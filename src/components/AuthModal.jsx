import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
    // Trigger animation after mount
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Start exit animation
    setIsVisible(false);
    
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setIsMounted(false);
    }, 300); // Matches CSS animation duration
  };

  if (!isMounted) return null;

  return (
    <div 
      className={`auth-modal-overlay ${isVisible ? 'visible' : ''}`}
      ref={overlayRef}
      onClick={handleClose}
    >
      <div 
        className={`auth-modal ${isVisible ? 'visible' : ''}`}
        ref={modalRef} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="close-button" 
          onClick={handleClose}
          aria-label="Close modal"
        >
          <span className="close-icon">&times;</span>
        </button>
        <h2>Start Your Journey</h2>
        <p className="modal-subtitle">Join our community today</p>
        <div className="auth-options">
          <button 
            className="auth-button login-button" 
            onClick={() => navigate('/login')}
          >
            <span className="button-text">Login</span>
            <span className="button-icon">→</span>
          </button>
          <button 
            className="auth-button signup-button" 
            onClick={() => navigate('/signup')}
          >
            <span className="button-text">Sign Up</span>
            <span className="button-icon">✚</span>
          </button>
        </div>
        <div className="modal-decoration">
          <div className="decor-circle decor-1"></div>
          <div className="decor-circle decor-2"></div>
          <div className="decor-circle decor-3"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;