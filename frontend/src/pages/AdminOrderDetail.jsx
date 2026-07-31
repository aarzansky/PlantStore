import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './AdminOrderDetail.css';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await adminAPI.getOrderById(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status) => {
    setUpdating(true);
    try {
      await adminAPI.updateOrderStatus(id, status);
      toast.success('Order status updated!');
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating order');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">Loading order...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <p>Order not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-order-detail">
        <button className="back-link" onClick={() => navigate('/admin/orders')}>
          &larr; Back to Orders
        </button>

        <div className="detail-card">
          <div className="detail-header">
            <div>
              <h1>{order.orderNumber}</h1>
              <p className="detail-date">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            {order.status === 'delivered' || order.status === 'cancelled' ? (
              <span className={`status-select status-locked ${order.status}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)} (locked)
              </span>
            ) : (
              <select
                value={order.status}
                disabled={updating}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`status-select ${order.status}`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="detail-grid">
            <div className="detail-block">
              <h2>Customer</h2>
              <p>
                {order.user?.firstName} {order.user?.lastName}
                <br />
                {order.user?.email}
              </p>
            </div>
            <div className="detail-block">
              <h2>Shipping Address</h2>
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
            <div className="detail-block">
              <h2>Payment</h2>
              <p>
                {order.paymentMethod === 'khalti' ? 'Khalti' : 'Cash on Delivery'}
                <br />
                {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
              </p>
            </div>
          </div>

          <div className="detail-block">
            <h2>Items</h2>
            <table className="detail-table">
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

          <div className="detail-total">
            <span>Total</span>
            <span>Rs.{order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrderDetail;
