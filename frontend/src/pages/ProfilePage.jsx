import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProfilePage.css';

const genderOptions = ['male', 'female', 'other'];

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const startEditing = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      gender: user.gender || '',
      country: user.country || '',
      city: user.city || '',
      address: user.address || '',
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await updateProfile(formData);
    setSaving(false);

    if (result.success) {
      toast.success('Profile updated!');
      setIsEditing(false);
      setFormData(null);
    } else {
      toast.error(result.error || 'Could not update profile');
    }
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
            <div className="profile-details-header">
              <h3>Personal Information</h3>
              {!isEditing && (
                <button className="edit-btn" onClick={startEditing}>
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="profile-edit-form">
                <div className="form-row">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    minLength={2}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    minLength={2}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Email</label>
                  <input type="email" value={user.email} disabled />
                </div>
                <div className="form-row">
                  <label>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Not specified</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-edit-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={cancelEditing}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
