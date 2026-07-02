import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { plantsAPI } from '../services/api';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch plants from API
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await plantsAPI.getAll();
        setPlants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plants:', error);
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  const features = [
    {
      title: "Wide Variety",
      description: "Explore variety of plants for your home",
      emoji: "🌿",
    },
    {
      title: "Economical",
      description: "Choose from a wide range of prices suitable for you",
      emoji: "💰",
    },
    {
      title: "Good Care",
      description: "Find care and maintenance tips for your plants",
      emoji: "💚",
    },
    {
      title: "Go Green",
      description: "Upgrade your living space with more greenery",
      emoji: "🌎",
    },
  ];

  const testimonials = [
    {
      text: '"Amazing Plants. The succulents I ordered were beautiful. I\'ve taken care of them for 20 years now"',
      author: "Aarzan, Flower Owner",
    },
    {
      text: '"Great selection and fast delivery. My monstera arrived in perfect condition!"',
      author: "Rakesh, Plant Enthusiast",
    },
    {
      text: '"The customer service is excellent. They helped me choose the perfect plant for my office!"',
      author: "Priya, Office Manager",
    },
  ];

  const categories = [
    "Pots",
    "Outdoor Plants",
    "Plant Care",
    "Aquatic Plants",
    "Creepers",
    "Succulents",
    "Fruits",
    "Indoor Plants",
    "Flowering Plants",
  ];

  function prevTestimonial() {
    setTestimonialIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  }

  function nextTestimonial() {
    setTestimonialIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  }

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to The Secret Garden</h1>
          <h2>Your go-to destination for home plants</h2>
          <p>
            Transform your space into a thriving green oasis — an all-in-one
            solution for creating, launching, and managing your plant collection.
          </p>
          <button className="btn-signup" onClick={() => navigate('/signup')}>
            Join us now
          </button>
          <button className="btn-signin" onClick={() => navigate('/signin')}>
            Already Joined?
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <p>Find Your Perfect Plant</p>
        <h2>Why Choose TheSecretGarden?</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.emoji}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Plants Section */}
      <section className="features">
        <h2>Featured Plants</h2>
        <div className="features-grid">
          {loading ? (
            <p>Loading plants...</p>
          ) : (
            plants.slice(0, 4).map((plant) => (
              <div className="feature-card" key={plant._id}>
                <div className="feature-icon">🌱</div>
                <h3>{plant.name}</h3>
                <p>Rs.{plant.price}</p>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate(`/plant/${plant._id}`)}
                  style={{ marginTop: '10px', padding: '8px 16px', fontSize: '14px' }}
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <button className="arrow-btn" onClick={prevTestimonial}>
          ‹
        </button>

        <div className="testimonial-card">
          <p className="testimonial-text">{testimonials[testimonialIndex].text}</p>
          <p className="testimonial-author">— {testimonials[testimonialIndex].author}</p>
        </div>

        <button className="arrow-btn" onClick={nextTestimonial}>
          ›
        </button>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Over 100 varieties of plants</h2>
        <h3>Make your home garden thrive with lively plants</h3>
        <p>Browse the plants you want and add to cart</p>

        <div className="category-cards">
          {categories.map((category, index) => (
            <div className="category-card" key={index}>
              {category}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Make Your First Plant Purchase?</h2>
        <button className="btn-primary" onClick={() => navigate('/plants')}>
          Browse Plants
        </button>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;