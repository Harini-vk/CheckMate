# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
from newspaper import Article
from pydub import AudioSegment
import speech_recognition as sr
import numpy as np
import tempfile
import google.generativeai as genai
import torch
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

# ----------------------------
# Load environment variables
# ----------------------------
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
SERP_API_KEY = os.getenv("SERP_API_KEY")

# ----------------------------
# Configure Gemini
# ----------------------------
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
    GEMINI_MODEL_NAME = "models/gemini-2.5-flash"
    gemini_model = genai.GenerativeModel(GEMINI_MODEL_NAME)
else:
    gemini_model = None
    print("⚠️ GOOGLE_API_KEY not set. Gemini features will be skipped.")

# ----------------------------
# Load Text Model (BERT)
# ----------------------------
TEXT_MODEL_NAME = "mrm8488/bert-tiny-finetuned-fake-news-detection"
tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_NAME)
text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_NAME)

# ----------------------------
# Load Image Model
# ----------------------------
BASE_DIR = os.path.abspath(os.getcwd())

candidate_paths = [
    os.path.join(BASE_DIR, "backend", "resnet50_real_fake_generator.h5"),
    os.path.join(BASE_DIR, "backend", "resnet50_real_fake_generator.keras"),
    os.path.join(BASE_DIR, "resnet50_real_fake_generator.h5"),
    os.path.join(BASE_DIR, "my_model", "deepfake_resnet50.h5"),
]

image_model = None
loaded_image_model_path = None
for p in candidate_paths:
    if os.path.exists(p):
        try:
            image_model = load_model(p, compile=False)
            loaded_image_model_path = p
            print(f"✅ Image model loaded from: {p}")
            break
        except Exception as e:
            print(f"Failed to load model at {p}: {e}")

if image_model is None:
    print("⚠️ Warning: Image model not loaded.")
    for p in candidate_paths:
        print(" -", p)

# ----------------------------
# Flask App Config
# ----------------------------
app = Flask(__name__)
CORS(app)

app.config["UPLOAD_FOLDER"] = os.path.join(BASE_DIR, "uploads")
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

ALLOWED_IMAGE_EXT = {"png", "jpg", "jpeg", "bmp"}

# ----------------------------
# SERP API Search
# ----------------------------
def search_serp(query):
    if not SERP_API_KEY:
        return []

    url = "https://serpapi.com/search"
    params = {
        "q": query,
        "api_key": SERP_API_KEY,
        "num": 3,
        "engine": "google"
    }

    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        results = []

        for res in data.get("organic_results", [])[:3]:
            results.append({
                "title": res.get("title", "No Title"),
                "link": res.get("link", "No Link"),
                "snippet": res.get("snippet", "No Snippet")
            })
        return results
    except Exception as e:
        print("SERP API fetch error:", e)
        return []

# ----------------------------
# Audio to Text
# ----------------------------
def audio_to_text(file):
    recognizer = sr.Recognizer()
    try:
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
            file.save(temp_file.name)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as wav_file:
                sound = AudioSegment.from_file(temp_file.name)
                sound.export(wav_file.name, format="wav")
                with sr.AudioFile(wav_file.name) as source:
                    audio_data = recognizer.record(source)
                    text = recognizer.recognize_google(audio_data, language="en-IN")
        os.remove(temp_file.name)
        os.remove(wav_file.name)
        return text
    except Exception as e:
        return f"Error converting audio: {e}"

# ----------------------------
# Extract Text from URL
# ----------------------------
def extract_text_from_url(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        return article.text
    except Exception as e:
        return f"Error extracting text from URL: {e}"

# ----------------------------
# Image Prediction Helper
# ----------------------------
def allowed_image(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_IMAGE_EXT

def predict_image(img_path):
    if image_model is None:
        return "Error: Image model not loaded."
    try:
        img = keras_image.load_img(img_path, target_size=(224, 224))
        img_array = keras_image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        pred = image_model.predict(img_array)[0]
        score = float(np.array(pred).ravel()[0])
        return "Real" if score < 0.5 else "Fake"
    except Exception as e:
        return f"Error analyzing image: {e}"

# ----------------------------
# Article Analysis Fallback
# ----------------------------
def analyze_articles_for_verdict(articles, claim):
    if not articles:
        return "Uncertain", "No articles available to verify the claim."

    fake_keywords = ["false", "hoax", "fake", "misinformation", "debunked"]
    real_keywords = ["true", "confirmed", "official"]

    for article in articles:
        snippet = article.get("snippet", "").lower()
        if any(k in snippet for k in fake_keywords):
            return "Fake", "Articles suggest the claim is false."
        if any(k in snippet for k in real_keywords):
            return "Real", "Articles confirm the claim."

    return "Uncertain", "Articles do not clearly confirm or debunk the claim."

# ----------------------------
# Text Analysis
# ----------------------------
def analyze_text(text):
    articles = search_serp(text)
    gemini_result = analyze_with_grounding(text, articles)

    verdict = gemini_result.get("verdict", "Uncertain")
    explanation = gemini_result.get("explanation", "No explanation available.")

    if explanation in ["", "No explanation available.", "No explanation"]:
        verdict, explanation = analyze_articles_for_verdict(articles, text)

    explanation = explanation[:300] + "..." if len(explanation) > 300 else explanation
    return verdict, explanation, articles

# ----------------------------
# Gemini Grounded Analysis
# ----------------------------
def analyze_with_grounding(claim, articles):
    if gemini_model is None:
        return {"verdict": "Uncertain", "explanation": "Gemini not configured"}

    articles_text = "\n".join(
        [f"Title: {a['title']}\nSnippet: {a['snippet']}\nLink: {a['link']}" for a in articles]
    )

    prompt = f"""
Claim: {claim}

Articles:
{articles_text}

Respond with:
VERDICT:
EXPLANATION:
"""

    try:
        response = gemini_model.generate_content(prompt)
        text = response.text.strip()

        verdict = "Uncertain"
        explanation = ""

        if "VERDICT:" in text:
            verdict = text.split("VERDICT:")[1].split("\n")[0].strip()
        if "EXPLANATION:" in text:
            explanation = text.split("EXPLANATION:")[1].strip()

        return {"verdict": verdict, "explanation": explanation}
    except Exception as e:
        return {"verdict": "Uncertain", "explanation": str(e)}

# ----------------------------
# /predict Endpoint
# ----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.form or request.get_json(force=True, silent=True)

    if "image" in request.files:
        img_file = request.files["image"]
        filename = secure_filename(img_file.filename)

        if not filename or not allowed_image(filename):
            return jsonify({"error": "Invalid image file"}), 400

        img_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        img_file.save(img_path)

        verdict = predict_image(img_path)
        return jsonify({"image_verdict": verdict})

    elif "audio" in request.files:
        audio_file = request.files["audio"]
        text = audio_to_text(audio_file)

        if text.startswith("Error"):
            return jsonify({"error": text}), 400

        verdict, explanation, articles = analyze_text(text)
        return jsonify({
            "transcribed_text": text,
            "text_verdict": verdict,
            "text_explanation": explanation,
            "text_articles": articles
        })

    elif data and "url" in data:
        text = extract_text_from_url(data["url"])
        verdict, explanation, articles = analyze_text(text)
        return jsonify({
            "transcribed_text": text,
            "text_verdict": verdict,
            "text_explanation": explanation,
            "text_articles": articles
        })

    elif data and "text" in data:
        verdict, explanation, articles = analyze_text(data["text"])
        return jsonify({
            "text_verdict": verdict,
            "text_explanation": explanation,
            "text_articles": articles
        })

    return jsonify({"error": "No valid input provided!"}), 400

# ----------------------------
# Run Flask App
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)