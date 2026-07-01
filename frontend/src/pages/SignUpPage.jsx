import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './SignUpPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    city: '',
    address: '',
    gender: '',
  });

  const personalFields = [
    { name: 'firstName', placeholder: 'First Name', type: 'text', minLength: 2 },
    { name: 'lastName', placeholder: 'Last Name', type: 'text', minLength: 2 },
    { name: 'email', placeholder: 'Email Address', type: 'email' },
    { name: 'password', placeholder: 'Create Password', type: 'password', minLength: 6 },
    { name: 'confirmPassword', placeholder: 'Confirm Password', type: 'password', minLength: 6 },
  ];

  const addressFields = [
    { name: 'country', placeholder: 'Country', type: 'text' },
    { name: 'city', placeholder: 'City', type: 'text' },
    { name: 'address', placeholder: 'Address', type: 'text' },
  ];

  const genderOptions = ['Male', 'Female', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!formData.gender) {
      setError('Please select your gender');
      return;
    }

    setLoading(true);

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="signup-left">
          <h2 className="signup-logo" onClick={() => navigate('/')}>
            🌿 TheSecretGarden
          </h2>

          <h1 className="signup-title">Join Us</h1>
          <p className="signup-subtitle">Join our plant-loving community today</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Personal Information Fields */}
            <div className="basic-info">
              {personalFields.map((field) => (
                <input
                  key={field.name}
                  className="signup-input"
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  minLength={field.minLength}
                />
              ))}
            </div>

            {/* Address Fields */}
            <div>
              {addressFields.map((field) => (
                <input
                  key={field.name}
                  className="signup-input"
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              ))}
            </div>

            {/* Gender Selection */}
            <div className="gender-selection">
              <label>Gender: </label>
              {genderOptions.map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="gender"
                    value={option.toLowerCase()}
                    checked={formData.gender === option.toLowerCase()}
                    onChange={handleChange}
                    required
                  />
                  {option}
                </label>
              ))}
            </div>

            <button className="signup-btn" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p className="signup-footer">
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/signin')}>
              Sign In
            </span>
          </p>
        </div>

        <div className="signup-right">
          <img
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800"
            alt="Plants"
            className="signup-image"
          />
        </div>
      </div>
    </>
  );
}

export default SignUpPage;