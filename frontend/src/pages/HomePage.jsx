import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-bg">
      <div className="home-container">
        <h1 className="home-title">IdentityGuard</h1>
        <p className="home-subtitle">
          IdentityGuard uses AI to detect deepfakes and protect your digital identity. 
          It helps verify the authenticity of images, videos, and creative work so that 
          you can stay in control of your online presence. Click below to access the <b>human verification tools (deepfake detection)</b>, 
          the <b>art authenticity tools (watermark embedding and verification)</b>, <b>similarity checker</b>, and <b>phishing email detector</b>. 
        </p>

        <div className="home-button-row">
          <button className="home-button" onClick={() => navigate("/human")}>
            Deepfake Detection
          </button>

          <button className="home-button" onClick={() => navigate("/art")}>
            Watermarker
          </button>

          <button className="home-button" onClick={() => navigate("/style")}>
            Similarity Checker
          </button>

          <button className="home-button" onClick={() => navigate("/phishing")}>
            Phishing Detection
          </button>

        </div>
      </div>
    </div>
  );
}