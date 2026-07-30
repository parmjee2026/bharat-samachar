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
      import React from "react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-mark">BS</div>

            <div>
              <h2>भारत समाचार</h2>
              <span>खबर जो मायने रखे</span>
            </div>
          </div>

          <p>
            भारत समाचार आपको राष्ट्रीय, अंतरराष्ट्रीय, व्यापार,
            तकनीक, खेल, मनोरंजन और स्वास्थ्य से जुड़ी
            विश्वसनीय एवं ताज़ा खबरें सरल भाषा में उपलब्ध कराता है।
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="/">होम</a>
          <a href="/national">राष्ट्रीय</a>
          <a href="/world">दुनिया</a>
          <a href="/business">व्यापार</a>
          <a href="/technology">टेक्नोलॉजी</a>
          <a href="/sports">खेल</a>
        </div>

        <div className="footer-links">
          <h3>Company</h3>

          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms & Conditions</a>
        </div>

        <div className="footer-links">
          <h3>Follow Us</h3>

          <a href="#">Facebook</a>
          <a href="#">X (Twitter)</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
          <a href="#">Telegram</a>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 Bharat Samachar • All Rights Reserved • Made in India 🇮🇳
      </div>
    </footer>
  );
}
