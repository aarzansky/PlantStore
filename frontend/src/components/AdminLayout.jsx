import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Check if user is admin
  React.useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', label: '📊 Dashboard', icon: '📊' },
    { path: '/admin/plants', label: '🌿 Plants', icon: '🌿' },
    { path: '/admin/users', label: '👥 Users', icon: '👥' },
    { path: '/admin/orders', label: '📦 Orders', icon: '📦' },
  ];

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          🌿 Admin Panel
        </div>
        <div className="admin-nav-links">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
        <div className="admin-nav-user">
          <span>{user?.firstName} {user?.lastName}</span>
          <button onClick={handleLogout} className="admin-logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;