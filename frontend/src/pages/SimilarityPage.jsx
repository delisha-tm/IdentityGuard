import React, { useState } from 'react';
import { API_BASE } from '../config';
import axios from 'axios';
import './PageStyles.css';
import UploadBox from '../components/UploadBox';
import SimilarityLabel from "../components/SimilarityLabel";

export default function SimilarityPage() {
  const [styleSamples, setStyleSamples] = useState([]);
  const [candidateFile, setCandidateFile] = useState(null);
  const [styleResult, setStyleResult] = useState(null);
  const [styleLoading, setStyleLoading] = useState(false);

  const handleStyle = async () => {
    if (!candidateFile || styleSamples.length === 0) return;

    setStyleLoading(true);
    setStyleResult(null);

    const form = new FormData();
    styleSamples.forEach((f) => form.append("sample_files", f));
    form.append("candidate_file", candidateFile);

    try {
      const r = await axios.post(`${API_BASE}/style_similarity`, form);
      setStyleResult(r.data);
    } catch (err) {
      setStyleResult({ error: err.message });
    } finally {
      setStyleLoading(false);
    }
  };

  return (
    <div className="page-grid">
      <section className="feature-section">
        <h2>Style Similarity Checker</h2>

        <div className="upload-row">
          <div className="upload-column">
            <center><p><b>Reference Style Image:</b></p></center>
            <UploadBox onFileSelect={(file) => setStyleSamples([file])} />
          </div>

          <div className="upload-column">
            <center><p><b>Candidate Image:</b></p></center>
            <UploadBox onFileSelect={setCandidateFile} />
          </div>
        </div>

        <button onClick={handleStyle} disabled={styleLoading}>
          {styleLoading ? "Checking..." : "Run Similarity"}
        </button>

        {styleResult && !styleResult.error && (
          <SimilarityLabel score={styleResult.average_similarity} />
        )}

        {styleResult && styleResult.error && (
          <pre className="results-box">{JSON.stringify(styleResult, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}