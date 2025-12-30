import React from "react";
import "./PredictionLabel.css";

export default function PredictionLabel({ prediction }) {
  const color = prediction === "real" ? "green" : "red";

  return (
    <div className="prediction-label-container">
      <p className="label">Prediction:</p>
      <p className="prediction-text" style={{ color }}>
        {prediction === "real" ? "Real" : "Artificial"}
      </p>
    </div>
  );
}