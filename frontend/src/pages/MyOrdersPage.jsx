import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './MyOrdersPage.css';

function MyOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await ordersAPI.cancel(id);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Could not cancel this order.');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading your orders...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="my-orders-page">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>You haven't placed any orders yet.</p>
            <button className="btn-primary" onClick={() => navigate('/plants')}>
              Browse Plants
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-card-top">
                  <div>
                    <span className="order-number">{order.orderNumber}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                </div>

                <div className="order-card-items">
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.name} x{item.quantity}
                      {i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div className="order-card-bottom">
                  <span className="order-total">Rs.{order.totalAmount.toFixed(2)}</span>
                  <div className="order-card-actions">
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button className="btn-cancel" onClick={() => handleCancel(order._id)}>
                        Cancel Order
                      </button>
                    )}
                    <button className="btn-view" onClick={() => navigate(`/orders/${order._id}`)}>
                      View Receipt
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

export default MyOrdersPage;
