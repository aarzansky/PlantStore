import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrderReceiptPage.css';

function OrderReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading receipt...</div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Navbar />
        <div className="receipt-error">
          <p>{error || 'Order not found'}</p>
          <Link to="/orders">Back to My Orders</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="receipt-page">
        {location.state?.justPlaced && (
          <div className="receipt-success">Your order has been placed successfully.</div>
        )}

        <div className="receipt-card" id="receipt">
          <div className="receipt-header">
            <div>
              <h1>Receipt</h1>
              <p className="receipt-order-number">{order.orderNumber}</p>
            </div>
            <span className={`order-status status-${order.status}`}>{order.status}</span>
          </div>

          <div className="receipt-meta">
            <div>
              <span className="meta-label">Order Date</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="meta-label">Payment Method</span>
              <span>{order.paymentMethod === 'khalti' ? 'Khalti' : 'Cash on Delivery'}</span>
            </div>
            <div>
              <span className="meta-label">Payment Status</span>
              <span>{order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}</span>
            </div>
          </div>

          <div className="receipt-section">
            <h2>Shipping To</h2>
            <p>
              {order.shippingAddress?.fullName}
              <br />
              {order.shippingAddress?.phone}
              <br />
              {order.shippingAddress?.address}, {order.shippingAddress?.city}
              <br />
              {order.shippingAddress?.country}
            </p>
          </div>

          <div className="receipt-section">
            <h2>Items</h2>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs.{item.price.toFixed(2)}</td>
                    <td>Rs.{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="receipt-total-row">
            <span>Total</span>
            <span>Rs.{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="receipt-actions">
          <button className="btn-outline" onClick={() => window.print()}>
            Print Receipt
          </button>
          <button className="btn-primary" onClick={() => navigate('/orders')}>
            Back to My Orders
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderReceiptPage;
