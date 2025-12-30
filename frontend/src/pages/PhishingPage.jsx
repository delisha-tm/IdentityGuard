import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import "./PageStyles.css";
import PredictionLabel from "../components/PredictionLabel";

export default function PhishingPage() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDetect = async () => {
    if (!emailText.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE}/detect_phishing`,
        { email_text: emailText },
        { headers: { "Content-Type": "application/json" } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page-grid">
      <section className="feature-section">
        <h2>Phishing Email Detection</h2>

        <label><b>Paste email content:</b></label>
        <textarea
          className="email-input"
          rows={8}
          placeholder="Paste the email text here..."
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
        />

        <button onClick={handleDetect} disabled={loading}>
          {loading ? "Analyzing..." : "Detect Phishing"}
        </button>

        {result && (
          <PredictionLabel prediction={result.prediction.includes("phishing") ? "artificial" : "real"} />
        )}
        
      </section>
    </div>
  );
}
