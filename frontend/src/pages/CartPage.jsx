import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CartPage.css';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please sign in to checkout');
      navigate('/signin');
      return;
    }
    alert('Proceeding to checkout...');
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Browse our plants and add some to your cart!</p>
          <button className="btn-primary" onClick={() => navigate('/plants')}>
            Browse Plants
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img 
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800'} 
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">Rs.{item.price}</p>
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        -
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  Rs.{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({getTotalItems()})</span>
              <span>Rs.{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs.{getTotalPrice().toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;