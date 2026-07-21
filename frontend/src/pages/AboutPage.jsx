import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutPage.css';

function AboutPage() {
  const values = [
    {
      icon: '🌱',
      title: 'Healthy plants, always',
      text: 'Every plant is hand-checked before it leaves our nursery, so what arrives at your door is ready to thrive.',
    },
    {
      icon: '🚚',
      title: 'Careful delivery',
      text: 'We pack each order to survive the trip, not just look nice on a shelf.',
    },
    {
      icon: '🤝',
      title: 'Real plant advice',
      text: "Not sure what will survive your windowsill? We're happy to help you pick the right plant for your space.",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="about-page">
        <div className="about-hero">
          <h1>🌿 TheSecretGarden</h1>
          <p>Bringing nature to your home since 2025.</p>
        </div>

        <div className="about-story">
          <h2>Our Story</h2>
          <p>
            TheSecretGarden started with a simple idea: buying a healthy plant online shouldn't
            be a gamble. We were tired of ordering plants that showed up wilted, mislabeled, or
            nothing like the photo - so we built the store we wished existed.
          </p>
          <p>
            Today we work directly with local growers and nurseries to bring a curated selection
            of houseplants, seeds, and plant care accessories to your doorstep, with the same
            care we'd want if we were buying for ourselves.
          </p>
        </div>

        <div className="about-values">
          <h2>What We Care About</h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AboutPage;
