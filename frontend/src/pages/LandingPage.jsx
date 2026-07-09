import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { plantsAPI, categoriesAPI } from '../services/api';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // Fetch categories from API so newly-added categories show up automatically
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data.map((cat) => cat.name));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
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
          <span className="hero-badge">🌿 Freshly picked, delivered with care</span>
          <h1>Welcome to The Secret Garden</h1>
          <h2>Your go-to destination for home plants</h2>
          <p>
            Transform your space into a thriving green oasis — an all-in-one
            solution for creating, launching, and managing your plant collection.
          </p>
          <div className="hero-actions">
            <button className="btn-signup" onClick={() => navigate('/signup')}>
              Join us now
            </button>
            <button className="btn-signin" onClick={() => navigate('/signin')}>
              Already Joined?
            </button>
          </div>
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
      <section className="features" id="plants">
        <h2>Featured Plants</h2>
        <div className="features-grid">
          {loading ? (
            <p>Loading plants...</p>
          ) : (
            plants.slice(0, 4).map((plant) => (
              <div className="feature-card plant-feature-card" key={plant._id}>
                <img
                  className="plant-feature-image"
                  src={plant.imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'}
                  alt={plant.name}
                />
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

      {/* Discounts Section */}
      <section className="discounts" id="discounts">
        <div className="discounts-content">
          <span className="discounts-tag">Limited time</span>
          <h2>Save on your first green friend</h2>
          <p>Use the codes below at checkout — offers refresh every season.</p>

          <div className="discount-cards">
            <div className="discount-card">
              <div className="discount-percent">15% OFF</div>
              <p>For first-time customers</p>
              <div className="discount-code">GREEN15</div>
            </div>
            <div className="discount-card">
              <div className="discount-percent">20% OFF</div>
              <p>On orders above Rs. 3000</p>
              <div className="discount-code">BLOOM20</div>
            </div>
            <div className="discount-card">
              <div className="discount-percent">FREE DELIVERY</div>
              <p>On your first order</p>
              <div className="discount-code">FIRSTFREE</div>
            </div>
          </div>

          <button className="btn-primary" onClick={() => navigate('/plants')}>
            Shop the sale
          </button>
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
          {categories.map((category) => (
            <div
              className="category-card"
              key={category}
              onClick={() => navigate(`/plants?category=${encodeURIComponent(category)}`)}
            >
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

      {/* About Section */}
      <section className="about" id="about">
        <h2>About TheSecretGarden</h2>
        <p>
          We're a small team of plant lovers on a mission to make greenery
          accessible to every home in Nepal. From easy-care succulents to
          statement monsteras, we hand-pick every plant and pair it with the
          care guidance you need to keep it thriving.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;