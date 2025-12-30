import React from 'react';
import './Navbar.css';

export default function Navbar({ currentPage, setPage }) {
  return (
    <nav className="navbar"> 
      <h2>IdentityGuard</h2> 
      
      <div className="nav-links"> 

        <button className={currentPage === 'human' ? 'active' : ''} onClick={() => setPage('human')}>
          Deepfake Detection
        </button>

        <button className={currentPage === 'art' ? 'active' : ''} onClick={() => setPage('art')}>
          Watermarking Tools
        </button>

        <button className={currentPage === 'style' ? 'active' : ''} onClick={() => setPage('style')}>
          Similarity Checker
        </button>

        <button className={currentPage === "phishing" ? "active" : ""} onClick={() => setPage("phishing")}>
          Phishing Detection
        </button>

      </div>
    </nav>
  );
}