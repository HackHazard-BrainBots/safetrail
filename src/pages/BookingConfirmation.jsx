import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bookingId = state?.bookingId || 'Unknown';
  const [showReviewModal, setShowReviewModal] = useState(false);
  const bookingDetails = state?.bookingDetails || {};

  const handleSubmitReview = async (reviewData) => {
    try {
      // Save review to localStorage
      const existingReviews = JSON.parse(localStorage.getItem('travelReviews')) || [];
      const updatedReviews = [...existingReviews, reviewData];
      localStorage.setItem('travelReviews', JSON.stringify(updatedReviews));
      
      // Mark booking as reviewed
      const bookings = JSON.parse(localStorage.getItem('flightBookings')) || [];
      const updatedBookings = bookings.map(booking => {
        if (booking.bookingId === bookingDetails.bookingId) {
          return { ...booking, reviewed: true };
        }
        return booking;
      });
      localStorage.setItem('flightBookings', JSON.stringify(updatedBookings));
      
      alert('Thank you for your review!');
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <h2>Booking Confirmed! ✈️</h2>
        <div className="confirmation-details">
          <p>Your flight has been successfully booked.</p>
          <p>Booking Reference: <strong>{bookingId}</strong></p>
          <p>A confirmation has been saved to your bookings.</p>
          <p>You earned crypto rewards for this booking!</p>
        </div>
        <div className="confirmation-actions">
          <button 
            className="view-bookings"
            onClick={() => navigate('/book-ticket', { state: { activeTab: 'status' } })}
          >
            View My Bookings
          </button>
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
          {!bookingDetails.reviewed && (
            <button 
              className="leave-review-button"
              onClick={() => setShowReviewModal(true)}
            >
              Leave a Review
            </button>
          )}
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          booking={bookingDetails}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default BookingConfirmation;