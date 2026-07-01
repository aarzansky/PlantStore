import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { plantsAPI } from '../services/api';
import './PlantDetailPage.css';

function PlantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await plantsAPI.getById(id);
        setPlant(response.data);
      } catch (error) {
        console.error('Error fetching plant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleAddToCart = () => {
    if (plant) {
      addToCart(plant, quantity);
      alert(`${plant.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading plant details...</div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div>
        <Navbar />
        <div className="error">Plant not found</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="plant-detail-page">
        <button className="back-btn" onClick={() => navigate('/plants')}>
          ← Back to Plants
        </button>
        
        <div className="plant-detail-container">
          <div className="plant-detail-image">
            <img 
              src={plant.imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'} 
              alt={plant.name}
            />
          </div>
          
          <div className="plant-detail-info">
            <h1>{plant.name}</h1>
            <p className="plant-category">{plant.category}</p>
            <p className="plant-price">${plant.price}</p>
            <p className="plant-description">{plant.description}</p>
            
            <div className="plant-stock">
              {plant.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({plant.stock} available)</span>
              ) : (
                <span className="out-of-stock">✗ Out of Stock</span>
              )}
            </div>

            <div className="quantity-selector">
              <label>Quantity:</label>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
              >
                -
              </button>
              <span className="qty-number">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(plant.stock, quantity + 1))}
                className="qty-btn"
                disabled={quantity >= plant.stock}
              >
                +
              </button>
            </div>

            <button 
              className="btn-primary add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={plant.stock === 0}
            >
              {plant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PlantDetailPage;