import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>भारत समाचार</h2>
          <p>
            भारत और दुनिया की विश्वसनीय खबरें, राजनीति, व्यापार, खेल,
            तकनीक, स्वास्थ्य और मनोरंजन की ताज़ा जानकारी।
          </p>
        </div>

        <div className="footer-links">
          <h3>मुख्य लिंक</h3>

          <a href="/">होम</a>
          <a href="/about">हमारे बारे में</a>
          <a href="/contact">संपर्क</a>
          <a href="/panchang">पंचांग</a>
        </div>

        <div className="footer-links">
          <h3>श्रेणियाँ</h3>

          <a href="/category/national">राष्ट्रीय</a>
          <a href="/category/world">दुनिया</a>
          <a href="/category/business">व्यापार</a>
          <a href="/category/sports">खेल</a>
        </div>
      </div>

      <div className="footer-bottom">
        © {year} भारत समाचार. All Rights Reserved.
      </div>
    </footer>
  );
}
