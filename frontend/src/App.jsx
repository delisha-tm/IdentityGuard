import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import HomePage from "./pages/HomePage";
import HumanPage from "./pages/HumanPage";
import ArtPage from "./pages/ArtPage";
import SimilarityPage from "./pages/SimilarityPage";
import PhishingPage from "./pages/PhishingPage";

import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="app-container">

        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-logo">IdentityGuard</Link>
          </div>

          <div className="nav-right">
            <Link to="/human" className="nav-link"><b>Deepfake Detection</b></Link>
            <Link to="/art" className="nav-link"><b>Watermarker</b></Link>
            <Link to="/style" className="nav-link"><b>Similarity Checker</b></Link>
            <Link to="/phishing" className="nav-link"><b>Phishing Detection</b></Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/human" element={<HumanPage />} />
            <Route path="/art" element={<ArtPage />} />
            <Route path="/style" element={<SimilarityPage />} />
            <Route path="/phishing" element={<PhishingPage />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}