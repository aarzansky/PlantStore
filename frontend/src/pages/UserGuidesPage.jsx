import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './UserGuidesPage.css';

function UserGuidesPage() {
  const guides = [
    {
      icon: '💧',
      title: 'Watering Basics',
      text: 'Most houseplants prefer to dry out slightly between waterings. Stick a finger an inch into the soil - if it\u2019s dry, it\u2019s time to water. Overwatering is the most common way new plant owners lose a plant.',
    },
    {
      icon: '☀️',
      title: 'Finding the Right Light',
      text: 'Bright, indirect light works for most houseplants - think a few feet back from a window, not direct midday sun. Check each plant\u2019s product page for its specific light needs.',
    },
    {
      icon: '🪴',
      title: 'Repotting a Plant',
      text: 'If roots are peeking out of the drainage holes or circling the surface, it\u2019s time to size up. Choose a pot just 1-2 inches larger in diameter and refresh the soil while you\u2019re at it.',
    },
    {
      icon: '🐛',
      title: 'Spotting Common Pests',
      text: 'Sticky leaves, tiny webs, or small flying insects near the soil are early signs of pests like mealybugs, spider mites, or fungus gnats. Isolate the plant and treat early to stop them from spreading.',
    },
    {
      icon: '🌡️',
      title: 'Temperature & Humidity',
      text: 'Most tropical houseplants thrive between 18-27°C and appreciate extra humidity. Keep plants away from cold drafts, heaters, and air conditioning vents.',
    },
    {
      icon: '🌿',
      title: 'Feeding Your Plants',
      text: 'A balanced liquid fertilizer every 4-6 weeks during spring and summer is enough for most houseplants. Hold off on feeding in the winter months when growth naturally slows down.',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="guides-page">
        <div className="guides-header">
          <h1>User Guides</h1>
          <p>Everything you need to keep your plants happy, from watering to repotting.</p>
        </div>

        <div className="guides-grid">
          {guides.map((g, i) => (
            <div className="guide-card" key={i}>
              <span className="guide-icon">{g.icon}</span>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserGuidesPage;
