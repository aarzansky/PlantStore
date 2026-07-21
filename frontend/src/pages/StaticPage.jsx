import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './StaticPage.css';

// A single reusable placeholder page used by all the "not built yet" footer
// links (Accessories, Gifts, Seeds, guides, blog, etc). Each route just
// passes a different title/description into this component.
function StaticPage({ title, description }) {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="static-page">
        <div className="static-page-card">
          <span className="static-page-icon">🌿</span>
          <h1>{title}</h1>
          <p>{description || "We're still potting the soil for this page — check back soon!"}</p>
          <button className="btn-primary" onClick={() => navigate('/plants')}>
            Browse Plants
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StaticPage;
