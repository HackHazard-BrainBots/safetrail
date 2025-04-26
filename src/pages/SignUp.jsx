import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaExclamationCircle, FaCheckCircle, FaUser, FaKey } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { signup as authSignup } from '../services/authService';
import './Auth.css';

const SignUp = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 25;
      if (/[A-Z]/.test(formData.password)) strength += 25;
      if (/\d/.test(formData.password)) strength += 25;
      if (/[!@#$%^&*]/.test(formData.password)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character');
      return;
    }

    try {
      const { username, email, password } = formData;
      const response = await authSignup({ username, email, password });
      
      if (response.message === 'User already exists') {
        setError('An account with this email already exists');
        return;
      }

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Begin Your Journey</h2>
          <p>Create an account to unlock amazing travel experiences</p>
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
              type="text" 
              name="username" 
              placeholder="👤 Choose a username" 
              required 
              onChange={handleChange}
              value={formData.username}
            />
          </div>

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
              placeholder="🔑 Create a password" 
              required 
              onChange={handleChange}
              value={formData.password}
            />
            <div className="password-strength">
              <div 
                className="password-strength-bar" 
                style={{
                  width: `${passwordStrength}%`,
                  backgroundColor: passwordStrength < 50 ? '#e74c3c' : 
                                   passwordStrength < 75 ? '#f39c12' : '#2ecc71'
                }}
              />
            </div>
            <p className="password-hint">
              Must include: uppercase letter, number, and special character (!@#$%^&*)
            </p>
          </div>

          <div className="form-group">
            <input 
              type="password" 
              name="confirmPassword" 
              placeholder="🔒 Confirm your password" 
              required 
              onChange={handleChange}
              value={formData.confirmPassword}
            />
          </div>

          <button type="submit" disabled={!!success}>
            {success ? 'Success!' : '🚀 Start Exploring Now'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;