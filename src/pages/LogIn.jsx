import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaExclamationCircle, FaCheckCircle, FaLock, FaEnvelope } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { login as authLogin } from '../services/authService';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { email, password } = formData;
      const { token, user } = await authLogin({ email, password });
      
      login(user, token);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your travel adventures</p>
        </div>

        {error && (
          <div className="message error-message">
            <FaExclamationCircle /> {error}
          </div>
        )}

        {success && (
          <div className="message success-message">
            <FaCheckCircle /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="✉️ Your email address" 
              required 
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              name="password" 
              placeholder="🔒 Your password" 
              required 
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          <button type="submit" disabled={!!success}>
            {success ? 'Success!' : '✈️ Sign In & Explore'}
          </button>
        </form>

        <div className="auth-footer">
          New to Safetrail? <Link to="/signup">Start your journey</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;