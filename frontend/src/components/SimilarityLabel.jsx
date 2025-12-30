import React from "react";
import "./SimilarityLabel.css";

export default function SimilarityLabel({ score }) {
  let level = "";
  let color = "";

  if (score >= 0.99) {
    level = "IDENTICAL";
    color = "red";
  } else if (score >= 0.75) {
    level = "High";
    color = "red";
  } else if (score >= 0.45) {
    level = "Medium";
    color = "orange";
  } else {
    level = "Low";
    color = "green";
  }

  const percent = (score * 100).toFixed(2);

  return (
    <div className="similarity-label-container">
      <p className="similarity-label-title">Similarity Level:</p>
      <p className="similarity-label-text" style={{ color }}>
        {level} — {percent}%
      </p>
    </div>
  );
}