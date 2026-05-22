import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./LandingPage.css";

function LandingPage({ setPage }) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const testimonials = [
    {
      text: '"Amazing Plants. The succulents I ordered were beautiful. I\'ve taken care of them for 20 years now"',
      author: "Aarzan, Flower Owner",
    },
    {
      text: '"Great selection and fast delivery. My monstera arrived in perfect condition!"',
      author: "Rakesh, Plant Enthusiast",
    },
  ];

  function prevTestimonial() {
    if (testimonialIndex > 0) {
      setTestimonialIndex(testimonialIndex - 1);
    }
  }

  function nextTestimonial() {
    if (testimonialIndex < testimonials.length - 1) {
      setTestimonialIndex(testimonialIndex + 1);
    }
  }

  return (
    <div>
      <Navbar setPage={setPage} />

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to The Secret Garden</h1>
          <h2>Your go-to destination for home plants</h2>
          <p>
            Transform your ideas into a thriving online store — an all-in-one
            solution for creating, launching, and managing your e-commerce
            website.
          </p>
          <button className="btn-primary" onClick={() => setPage("signin")}>
            Join us now
          </button>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Why Choose TheSecretGarden?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Wide Variety</h3>
            <p>Explore variety of plants for your home</p>
          </div>

          <div className="feature-card">
            <h3>Economical</h3>
            <p>Choose from a wide range of price suitable for you</p>
          </div>

          <div className="feature-card">
            <h3>Good Care</h3>
            <p>Find care and maintenance tips for your plants to help keep them healthy</p>
          </div>

          <div className="feature-card">
            <h3>Go Green</h3>
            <p>Upgrade your living space with more greenery</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <button className="arrow-btn" onClick={prevTestimonial}>‹</button>

        <div className="testimonial-card">
          <p className="testimonial-text">{testimonials[testimonialIndex].text}</p>
          <p className="testimonial-author">{testimonials[testimonialIndex].author}</p>
        </div>

        <button className="arrow-btn" onClick={nextTestimonial}>›</button>
      </section>

      <section className="categories">
        <h2>Over 100 varieties of plants</h2>
        <h3>Make your home garden thrive with lively plants</h3>
        <p>Browse the plants you want and add to cart</p>

        <div className="category-cards">
          <div className="category-card">🪴 Pots</div>
          <div className="category-card">🌿 Outdoor Plants</div>
          <div className="category-card">🌱 Plant Care</div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Launch Make Your First Plant Purchase?</h2>
        <button className="btn-primary" onClick={() => setPage("signin")}>
          Start Now
        </button>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
