import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { plantsAPI, categoriesAPI } from '../services/api';
import './PlantsPage.css';

function PlantsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  // Pre-select a category if we arrived via a link like /plants?category=Succulents
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(['All', ...response.data.map((cat) => cat.name)]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        let response;
        if (selectedCategory === 'All') {
          response = await plantsAPI.getAll();
        } else {
          response = await plantsAPI.getByCategory(selectedCategory);
        }
        setPlants(response.data);
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [selectedCategory]);

  const handleAddToCart = (plant) => {
    addToCart(plant);
    alert(`${plant.name} added to cart!`);
  };

  return (
    <div>
      <Navbar />
      <div className="plants-page">
        <h1>Our Plants Collection</h1>
        
        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Plants Grid */}
        {loading ? (
          <div className="loading">Loading plants...</div>
        ) : (
          <div className="plants-grid">
            {plants.map((plant) => (
              <div className="plant-card" key={plant._id}>
                <img 
                  src={plant.imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'} 
                  alt={plant.name}
                  className="plant-image"
                  onClick={() => navigate(`/plant/${plant._id}`)}
                />
                <div className="plant-info">
                  <h3>{plant.name}</h3>
                  <p className="plant-category">{plant.category}</p>
                  <p className="plant-price">Rs.{plant.price}</p>
                  <div className="plant-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleAddToCart(plant)}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="btn-outline"
                      onClick={() => navigate(`/plant/${plant._id}`)}
                      style={{ padding: '8px 16px', fontSize: '14px' }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PlantsPage;