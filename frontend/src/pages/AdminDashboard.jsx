import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import AdminLayout from '../components/AdminLayout';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders);
    } catch (error) {
      console.error('Error fetching stats:', error);
      if (error.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1>Dashboard</h1>
        
        <div className="stats-row">
          <div className="stat-block">
            <span className="stat-value">{stats?.totalPlants || 0}</span>
            <span className="stat-label">Total Plants</span>
          </div>
          <div className="stat-block">
            <span className="stat-value">{stats?.totalUsers || 0}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-block">
            <span className="stat-value">{stats?.totalOrders || 0}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-block">
            <span className="stat-value">Rs.{stats?.totalRevenue?.toFixed(2) || '0.00'}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>

        <div className="recent-orders">
          <h2>Recent Orders</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>No orders yet</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-6)}</td>
                      <td>{order.user?.firstName} {order.user?.lastName}</td>
                      <td>Rs.{order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`status-dot status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;