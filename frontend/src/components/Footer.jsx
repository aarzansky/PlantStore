// components/Footer.jsx - Using map for footer sections
import React from "react";
import "./Footer.css";

function Footer() {
  // Data for footer sections - easy to update
  const footerData = [
    {
      title: "Product",
      links: ["Plants", "Accessories", "Gifts", "Seeds"],
    },
    {
      title: "Resources",
      links: ["User guides", "Blog", "FAQs", "Plant Care"],
    },
    {
      title: "Company",
      links: ["About", "Join us", "Contact", "Privacy Policy"],
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3>🌿 TheSecretGarden</h3>
          <p>Bringing nature to your home since 2025</p>
        </div>

        {footerData.map((section, index) => (
          <div className="footer-column" key={index}>
            <h4>{section.title}</h4>
            {section.links.map((link, linkIndex) => (
              <a key={linkIndex} href={`#${link.toLowerCase().replace(" ", "")}`}>
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 TheSecretGarden · Privacy · Terms</p>
      </div>
    </footer>
  );
}

export default Footer;