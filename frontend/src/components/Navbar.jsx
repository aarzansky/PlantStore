import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  const navLinks = ["Plants", "Care", "Features", "About us"];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        🌿 TheSecretGarden
      </div>

      <div className="navbar-links">
        {navLinks.map((link, index) => (
          <a key={index} href={`/${link.toLowerCase().replace(" ", "")}`}>
            {link}
          </a>
        ))}
      </div>

      <div className="navbar-buttons">
        <button 
          className="btn-outline" 
          onClick={() => navigate('/cart')}
          style={{ position: 'relative' }}
        >
          🛒 Cart
          {getTotalItems() > 0 && (
            <span className="cart-badge">{getTotalItems()}</span>
          )}
        </button>
        
        {isAuthenticated ? (
          <>
            <button 
              className="btn-outline" 
              onClick={() => navigate('/profile')}
            >
              {user?.firstName}
            </button>
            <button 
              className="btn-primary" 
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate('/signin')}>
              Sign in
            </button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;