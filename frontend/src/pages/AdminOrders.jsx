import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { adminAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './AdminOrders.css';

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating order');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await adminAPI.deleteOrder(id);
        toast.success('Order deleted successfully!');
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting order');
      }
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <AdminLayout>
      <div className="admin-orders">
        <div className="admin-header">
          <h1>Manage Orders</h1>
          <span className="order-count">Total: {orders.length} orders</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>
                      {order.user?.firstName} {order.user?.lastName}
                      <br />
                      <small>{order.user?.email}</small>
                    </td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td>Rs.{order.totalAmount.toFixed(2)}</td>
                    <td>
                      {order.status === 'delivered' || order.status === 'cancelled' ? (
                        <span className={`status-select status-locked ${order.status}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)} (locked)
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`status-select ${order.status}`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn-view-order"
                          onClick={() => navigate(`/admin/orders/${order._id}`)}
                        >
                          View
                        </button>
                        {/* <button
                          className="btn-delete"
                          onClick={() => handleDelete(order._id)}
                        >
                          Delete
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;