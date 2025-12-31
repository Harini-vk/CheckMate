
// export default TextVerifier;
import React, { useState } from "react";

const TextVerifier = () => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!text.trim() && !url.trim() && !audioFile) {
      return alert("Enter text, URL, or upload audio!");
    }
    setLoading(true);

    try {
      const formData = new FormData();

      if (text.trim()) formData.append("text", text);
      if (url.trim()) formData.append("url", url);
      if (audioFile) formData.append("audio", audioFile);

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Server error, check backend!");
    }

    setLoading(false);
  };

  return (
    <div className="verifier max-w-md mx-auto p-4 bg-gray-100 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">🕵️‍♀️ CHECKMATE</h1>

      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder="Paste news text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        className="w-full p-2 border rounded mb-2"
        type="text"
        placeholder="OR enter URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <p className="mb-1">OR Upload Audio (Tamil / English)</p>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudioFile(e.target.files[0])}
      />

      <button
        className="mt-3 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {result && (
        <div className="result mt-4 p-2 bg-white border rounded">
          {result.transcribed_text && (
            <>
              <h3 className="font-semibold mb-1">📝 Transcribed Text:</h3>
              <p>{result.transcribed_text}</p>
            </>
          )}

          {result.text_final_verdict && (
            <>
              <h2 className="font-bold mt-2">🧠 Text Verdict: {result.text_final_verdict}</h2>
              <p>🤖 Local Model: {result.text_local_model}</p>
              <p>🌐 Gemini: {result.text_gemini_result}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TextVerifier;
