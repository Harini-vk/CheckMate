# Checkmate – Multimodal Fake News & Deepfake Detection System

Checkmate is a Flask-based backend application that detects **fake or real content** using multiple input formats:
- Text
- Images
- Audio
- News URLs

It combines **machine learning models**, **search-based verification**, and **LLM reasoning** to provide a final verdict.

---

## 🚀 Features

- 📝 **Text Analysis**
  - Fake news detection using a fine-tuned BERT model
  - Fact-checking using SERP API
  - Explanation generation using Gemini (Google Generative AI)

- 🖼 **Image Analysis**
  - Deepfake image detection using a ResNet50-based model

- 🔊 **Audio Analysis**
  - Converts speech to text
  - Performs fake news analysis on transcribed content

- 🌐 **URL Analysis**
  - Extracts article text from news URLs
  - Verifies claims using search results and AI reasoning

- 🧠 **Grounded AI Reasoning**
  - Gemini is used with real-world articles as grounding sources
  - Fallback logic when AI response is unavailable

---

## 🛠 Tech Stack

- **Backend:** Flask, Flask-CORS
- **NLP:** HuggingFace Transformers (BERT)
- **Image ML:** TensorFlow / Keras (ResNet50)
- **Audio Processing:** SpeechRecognition, PyDub
- **Web Scraping:** newspaper3k
- **Search Verification:** SERP API
- **LLM:** Google Gemini
- **Language:** Python

---

## 📁 Project Structure
backend/
│
├── app.py # Main Flask application
├── uploads/ # Uploaded images/audio
├── models/ # ML models (image/text)
├── requirements.txt
└── .env # API keys (not committed)

---

## 🔑 Environment Variables

Create a `.env` file in the project root:
GOOGLE_API_KEY=your_gemini_api_key
NEWSAPI_KEY=your_newsapi_key
SERP_API_KEY=your_serpapi_key

![checkmate](https://github.com/user-attachments/assets/fa801c64-5d5b-4b60-b108-c0a9ffc639a7)
![checkmate2](https://github.com/user-attachments/assets/e82c0954-6bb2-47d4-bc7f-ba556f5f223b)
![checkmate3](https://github.com/user-attachments/assets/975b2e8c-132e-40e5-987a-88c26c7be483)


