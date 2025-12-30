import React, { useState } from 'react';
import { API_BASE } from '../config';
import axios from 'axios';
import './PageStyles.css';
import UploadBox from '../components/UploadBox';

export default function ArtPage() {
  const [embedFile, setEmbedFile] = useState(null);
  const [embedResult, setEmbedResult] = useState(null);
  const [embedLoading, setEmbedLoading] = useState(false);

  const handleEmbed = async () => {
    if (!embedFile) return;
    setEmbedLoading(true);
    setEmbedResult(null);

    const form = new FormData();
    form.append("file", embedFile);
    form.append("watermark_text", "© IdentityGuard");

    try {
      const r = await axios.post(`${API_BASE}/embed_watermark`, form, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked.jpg";
      a.click();
      setEmbedResult({ message: "Watermarked file downloaded!" });
    } catch (err) {
      setEmbedResult({ error: err.message });
    } finally {
      setEmbedLoading(false);
    }
  };

  return (
    <div className="page-grid">
      <section className="feature-section">
        <h2>Embed Watermark</h2>

        <UploadBox onFileSelect={setEmbedFile} />

        <button onClick={handleEmbed} disabled={embedLoading}>
          {embedLoading ? "Embedding..." : "Embed & Download"}
        </button>

        {embedResult && (
          <pre className="results-box">
            {JSON.stringify(embedResult, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}