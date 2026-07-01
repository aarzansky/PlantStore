import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="signin-page">
        <div className="signin-left">
          <h2 className="signin-logo" onClick={() => navigate('/')}>
            🌿 TheSecretGarden
          </h2>

          <p className="signin-subtitle">Log in to your account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              className="signin-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="signin-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="signin-btn" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <p className="signin-footer">
            Don't have an account?{' '}
            <span className="link" onClick={() => navigate('/signup')}>
              Sign Up
            </span>
          </p>
        </div>

        <div className="signin-right">
          <img
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800"
            alt="Plant decoration"
            className="signin-image"
          />
        </div>
      </div>
    </>
  );
}

export default SignInPage;