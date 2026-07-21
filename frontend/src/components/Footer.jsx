// components/Footer.jsx - Using map for footer sections
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  // Data for footer sections - easy to update.
  // Every link has a real destination now, except Privacy Policy which
  // stays a placeholder for later.
  const footerData = [
    {
      title: "Product",
      links: [
        { label: "Plants", to: "/plants" },
        { label: "Accessories", to: "/accessories" },
        { label: "Gifts", to: "/gifts" },
        { label: "Seeds", to: "/seeds" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "User guides", to: "/guides" },
        { label: "Blog", to: "/blog" },
        { label: "FAQs", to: "/faqs" },
        { label: "Plant Care", to: "/plant-care" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", to: "/about" },
        { label: "Join us", to: "/signin" },
        { label: "Contact", to: "/contact" },
        { label: "Privacy Policy", to: null },
      ],
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
            {section.links.map((link, linkIndex) =>
              link.to ? (
                <a
                  key={linkIndex}
                  href={link.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(link.to);
                  }}
                >
                  {link.label}
                </a>
              ) : (
                // Privacy Policy isn't built yet - render as inert text
                // instead of a working link.
                <span key={linkIndex} className="footer-link-disabled">
                  {link.label}
                </span>
              )
            )}
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
