import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3> TheSecretGarden</h3>
        </div>

        <div className="footer-column">
          <h4>Product</h4>
          <a href="#features">Plants</a>
          <a href="#pricing">Accessories</a>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <a href="#guides">User guides</a>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <a href="#about">About</a>
          <a href="#join">Join us</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 TheSecretGarden · Privacy · Terms</p>
      </div>
    </footer>
  );
}

export default Footer;
