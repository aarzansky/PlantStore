import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutPage.css';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    phone: '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Nepal',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add a few plants before checking out.</p>
          <button className="btn-primary" onClick={() => navigate('/plants')}>
            Browse Plants
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setError('Please fill in all the shipping details.');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
      }));

      if (paymentMethod === 'khalti') {
        const response = await ordersAPI.initiateKhalti({
          items: orderItems,
          shippingAddress: form,
        });

        // Cart is cleared once payment is confirmed as completed, not before -
        // if the user abandons the Khalti page, the order still exists as 'unpaid'.
        window.location.href = response.data.payment_url;
        return;
      }

      const response = await ordersAPI.create({
        items: orderItems,
        shippingAddress: form,
        paymentMethod: 'cod',
      });

      clearCart();
      navigate(`/orders/${response.data.order._id}`, { state: { justPlaced: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong placing your order.');
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-container">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            <h2>Shipping Details</h2>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Aarzan Shrestha"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 98XXXXXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, ward, landmark"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu"
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <span className="payment-title">Cash on Delivery</span>
                  <span className="payment-subtitle">Pay when your order arrives</span>
                </div>
              </label>
              <label className={`payment-option ${paymentMethod === 'khalti' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'khalti'}
                  onChange={() => setPaymentMethod('khalti')}
                />
                <div>
                  <span className="payment-title">Khalti</span>
                  <span className="payment-subtitle">Pay instantly with your Khalti wallet</span>
                </div>
              </label>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            <button type="submit" className="checkout-btn" disabled={submitting}>
              {submitting
                ? paymentMethod === 'khalti'
                  ? 'Redirecting to Khalti...'
                  : 'Placing Order...'
                : paymentMethod === 'khalti'
                ? 'Pay with Khalti'
                : 'Place Order'}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div className="summary-item" key={item._id}>
                  <span className="summary-item-name">
                    {item.name} <small>x{item.quantity}</small>
                  </span>
                  <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
