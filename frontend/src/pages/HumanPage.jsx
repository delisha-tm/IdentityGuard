import React, { useState } from "react";
import { API_BASE } from "../config";
import axios from "axios";
import "./PageStyles.css";
import UploadBox from "../components/UploadBox";
import PredictionLabel from "../components/PredictionLabel";

export default function HumanPage() {
  const [deepfakeFile, setDeepfakeFile] = useState(null);
  const [deepfakeResult, setDeepfakeResult] = useState(null);
  const [deepfakeLoading, setDeepfakeLoading] = useState(false);
  
  const handleDeepfake = async () => {
    if (!deepfakeFile) return;
    setDeepfakeLoading(true);
    setDeepfakeResult(null);

    const form = new FormData();
    form.append("file", deepfakeFile);

    try {
      const r = await axios.post(`${API_BASE}/detect_deepfake`, form);
      setDeepfakeResult(r.data);
    } catch (err) {
      setDeepfakeResult({ error: err.message });
    } finally {
      setDeepfakeLoading(false);
    }
  };

  return (
    <div className="page-grid">

      <section className="feature-section">
        <h2>Deepfake Face Detection</h2>
        <UploadBox onFileSelect={setDeepfakeFile} />

        <button onClick={handleDeepfake} disabled={deepfakeLoading}>
          {deepfakeLoading ? "Analyzing..." : "Run Detection"}
        </button>

        {deepfakeResult?.prediction && !deepfakeResult.error && (
          <PredictionLabel prediction={deepfakeResult.prediction} />
        )}

        {deepfakeResult && deepfakeResult.error && (
          <pre className="results-box">{JSON.stringify(deepfakeResult, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}