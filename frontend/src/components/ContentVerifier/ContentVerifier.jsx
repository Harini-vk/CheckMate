
// export default ContentVerifier;
import React, { useState, useRef, useEffect } from "react";
import "./ContentVerifier.css";

const ContentVerifier = () => {
  const [activeTab, setActiveTab] = useState("Text");
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [url, setUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reference to the result area for scrolling
  const resultRef = useRef(null);

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [result]);

  // Function to handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleVerify = async () => {
    setResult(null);

    let hasInput = false;
    switch (activeTab) {
      case "Text":
        hasInput = text.trim().length > 0;
        break;
      case "Image":
        hasInput = imageFile !== null;
        break;
      case "URL":
        hasInput = url.trim().length > 0;
        break;
      case "Audio":
        hasInput = audioFile !== null;
        break;
      default:
        break;
    }

    if (!hasInput) {
      alert(`Please provide input for ${activeTab}!`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      const endpoint = "/api/predict"; 

      switch (activeTab) {
        case "Text":
          formData.append("text", text);
          break;
        case "Image":
          formData.append("image", imageFile);
          break;
        case "URL":
          formData.append("url", url);
          break;
        case "Audio":
          formData.append("audio", audioFile);
          break;
        default:
          break;
      }

      // --- Mock API Call for demonstration (remove in production) ---
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      let finalVerdict = "REAL";
      let explanation = "The content appears to align with verified sources.";
      let transcribedText = undefined;
      let relatedArticles = [];

      // Logic to determine a single, final verdict based on the active tab/input
      if (activeTab === "Text") {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes("fake") || lowerText.includes("false")) {
            finalVerdict = "FAKE";
            explanation = "Analysis showed high divergence from known real-world data sources, indicating potential manipulation.";
        } else if (lowerText.includes("climate") || lowerText.includes("vaccine")) {
            finalVerdict = "UNCERTAIN";
            explanation = "The claim is on a sensitive topic with ongoing debate; review the linked fact-checks for context.";
            relatedArticles = [
                { title: "Article 1: Fact Check on Climate Claim", snippet: "Review of scientific consensus versus public claim.", link: "#" },
                { title: "Article 2: Misinformation About Vaccines", snippet: "Expert review of common claims and data.", link: "#" }
            ];
        } else {
            // Defaults to REAL
            finalVerdict = "REAL";
            explanation = "The content appears to align with verified sources and lacks characteristics of typical misinformation.";
        }
      } else if (activeTab === "Image") {
          finalVerdict = "FAKE";
          explanation = "Digital forensic analysis detected anomalies suggesting the image was AI-generated or heavily edited. (This is the final verdict for the image).";
      } else if (activeTab === "URL") {
          finalVerdict = "UNCERTAIN";
          explanation = "The article contains conflicting information from unverified sources. Review the related fact-checks.";
          relatedArticles = [
              { title: "Source 1: How to Spot Deepfakes", snippet: "Experts detail the latest methods for detecting AI-generated content.", link: "#" },
              { title: "Source 2: Fact-Check on the Claim", snippet: "A review of the claim against historical data and official statements.", link: "#" }
          ];
      } else if (activeTab === "Audio") {
          finalVerdict = "REAL";
          explanation = "Spectrographic analysis confirms natural human voice inflections and cadence, consistent with known recordings.";
          transcribedText = "This is a demonstration of transcribed text from the audio input.";
      }

      const mockResult = {
        "final_verdict": finalVerdict,
        "explanation": explanation,
        "transcribed_text": transcribedText,
        "text_articles": relatedArticles,
      };
      
      const data = mockResult;
      // --- End Mock API Call ---

      // --- Actual API Call (uncomment in production) ---
      /*
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      */
      // --- End Actual API Call ---

      setResult(data);
    } catch (err) {
      console.error("Verification error:", err);
      alert("Verification failed. Please check the backend connection.");
      setResult({ error: "Verification failed. Please check the backend connection or console for details." });
    }

    setLoading(false);
  };

  const renderInputArea = () => {
    switch (activeTab) {
      case "Text":
        return (
          <textarea
            className="input-area__textarea"
            placeholder="Paste the text or claim to verify..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        );
      case "Image":
        return (
          <div className="input-area__file-container">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="input-area__file-input"
              onChange={handleImageChange}
            />
            <label htmlFor="image-upload" className="file-upload-label">
              {imagePreviewUrl ? (
                <>
                  <img src={imagePreviewUrl} alt="Preview" className="image-preview" />
                  <span className="file-upload-name-confirmation">{imageFile.name}</span>
                </>
              ) : (
                <div className="file-upload-content">
                  <div className="file-upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                  </div>
                  <span className="file-upload-text">
                    {imageFile ? imageFile.name : "Click to upload image"}
                  </span>
                  <span className="file-upload-hint">JPG, PNG up to 10MB</span>
                </div>
              )}
            </label>
          </div>
        );
      case "URL":
        return (
          <input
            className="input-area__input"
            type="url"
            placeholder="Paste the article URL (e.g., https://example.com/article)..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        );
      case "Audio":
        return (
          <div className="input-area__file-container">
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="input-area__file-input"
              onChange={(e) => setAudioFile(e.target.files[0])}
            />
            <label htmlFor="audio-upload" className="file-upload-label">
              <div className="file-upload-content">
                <div className="file-upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM21 16c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z" />
                  </svg>
                </div>
                <span className="file-upload-text">
                  {audioFile ? audioFile.name : "Click to upload audio"}
                </span>
                <span className="file-upload-hint">MP3, WAV up to 10MB</span>
              </div>
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const getVerdictClass = (verdict) => {
    if (verdict === "REAL") return "real";
    if (verdict === "FAKE") return "fake";
    return "uncertain";
  };

  const getVerdictIcon = (verdict) => {
    if (verdict === "REAL") return "✓";
    if (verdict === "FAKE") return "✕";
    return "•";
  };

  return (
    <div className="verifier-container" id="content-verifier">
      <div className="verifier-card">
        <header className="verifier-header">
          <h1 className="verifier-header__title">Content Verifier</h1>
          <p className="verifier-header__subtitle">
           Detect <strong>Fake</strong> or <strong>Real</strong> Content across Text, Images, Audio, and URLs
         </p>

        </header>

        <div className="tab-navigation">
          {["Text", "Image", "URL", "Audio"].map((tab) => (
            <button
              key={tab}
              className={`tab-navigation__button ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab(tab);
                setResult(null); // Clear results on tab change
                setImagePreviewUrl(null); // Clear image preview on tab change
                setImageFile(null); // Clear image file on tab change
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="input-wrapper">{renderInputArea()}</div>

        <button
          className="verify-button"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Verifying {activeTab}...
            </>
          ) : (
            `Verify ${activeTab}`
          )}
        </button>

        {result && (
          <div className="result-area" ref={resultRef}>
            <div className="result-header">
              <h2 className="result-header__title">Verification Report</h2>
            </div>

            {/* Transcribed Text Card (e.g., from Audio) */}
            {result.transcribed_text && (
              <div className="result-card result-card--neutral">
                <div className="result-card__header">
                  <h3 className="result-card__title">Transcribed Text</h3>
                </div>
                <div className="result-card__body">
                  <p className="transcription-text">"{result.transcribed_text}"</p>
                </div>
              </div>
            )}
            
            {/* Final Verdict Card (Now the ONLY source of the verdict) */}
            {result.final_verdict && (
              <div className={`result-card result-card--${getVerdictClass(result.final_verdict)} result-card--primary`}>
                <div className="result-card__header">
                  <span className="result-card__icon result-card__icon--large">{getVerdictIcon(result.final_verdict)}</span>
                  <h3 className="result-card__title">Final Content Verdict</h3>
                </div>
                <div className="result-card__body">
                  <div className="verdict-badge verdict-badge--xlarge">
                    <span className={`verdict-badge__label verdict-badge__label--${getVerdictClass(result.final_verdict)}`}>
                      {result.final_verdict}
                    </span>
                  </div>
                  {result.explanation && (
                    <p className="result-explanation"><strong>Reasoning:</strong> {result.explanation}</p>
                  )}
                </div>
              </div>
            )}

            {/* Related Articles Card */}
            {result.text_articles && result.text_articles.length > 0 && (
              <div className="result-card result-card--neutral">
                <div className="result-card__header">
                  <h3 className="result-card__title">Related Fact-Checks & Articles</h3>
                  <span className="article-count">{result.text_articles.length} found</span>
                </div>
                <div className="result-card__body">
                  <ul className="article-list">
                    {result.text_articles.map((article, index) => (
                      <li key={index} className="article-item">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="article-link"
                        >
                          <h4 className="article-title">{article.title}</h4>
                        </a>
                        <p className="article-snippet">{article.snippet}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Error Card */}
            {result.error && (
              <div className="result-card result-card--error">
                <div className="result-card__header">
                  <span className="result-card__icon">⚠</span>
                  <h3 className="result-card__title">Verification Error</h3>
                </div>
                <div className="result-card__body">
                  <p className="error-message">{result.error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentVerifier;
