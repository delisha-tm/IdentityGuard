import React, { useState, useRef } from "react";
import "./UploadBox.css"; 

export default function UploadBox({ onFileSelect }) {
  const [preview, setPreview] = useState(null);

  const dropRef = useRef();

  const handleFile = (file) => {
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setPreview(imageURL);
    onFileSelect(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    dropRef.current.classList.remove("drag-active");

    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const onDragEnter = () => dropRef.current.classList.add("drag-active");
  const onDragLeave = () => dropRef.current.classList.remove("drag-active");
  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="upload-wrapper">
      
      <div className="drop-area" ref={dropRef} onDrop={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <p>Drag & Drop your image here</p>
        <p className="or">— or —</p>

        <label className="file-label">
          Choose File
          <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])}/>
        </label>
      </div>

      {preview && (
        <div className="preview-container">
          <h3>Preview:</h3>
          <img src={preview} alt="Uploaded" className="preview-image" />
        </div>
      )}
    </div>
  );
}