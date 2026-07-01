import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <Navbar />
      <div className="profile-page">
        <h1>My Profile</h1>
        
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-avatar">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <h2>{user.firstName} {user.lastName}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-gender">Gender: {user.gender || 'Not specified'}</p>
          </div>

          <div className="profile-details">
            <h3>Personal Information</h3>
            <div className="detail-row">
              <span>First Name:</span>
              <span>{user.firstName}</span>
            </div>
            <div className="detail-row">
              <span>Last Name:</span>
              <span>{user.lastName}</span>
            </div>
            <div className="detail-row">
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
            {user.country && (
              <div className="detail-row">
                <span>Country:</span>
                <span>{user.country}</span>
              </div>
            )}
            {user.city && (
              <div className="detail-row">
                <span>City:</span>
                <span>{user.city}</span>
              </div>
            )}
            {user.address && (
              <div className="detail-row">
                <span>Address:</span>
                <span>{user.address}</span>
              </div>
            )}
            
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;