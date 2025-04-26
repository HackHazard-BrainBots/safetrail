// components/ReviewForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewForm.css';

function ReviewForm({ bookingId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const userData = JSON.parse(localStorage.getItem('travelgo_user')) || {};
      const reviews = JSON.parse(localStorage.getItem('travelReviews')) || [];

      const newReview = {
        id: Date.now().toString(),
        userId: userData.id || 'anonymous',
        bookingId,
        rating,
        comment,
        date: new Date().toISOString(),
        userName: userData.name || 'Anonymous'
      };

      reviews.push(newReview);
      localStorage.setItem('travelReviews', JSON.stringify(reviews));

      // Update booking to mark as reviewed
      const bookings = JSON.parse(localStorage.getItem('flightBookings')) || [];
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId ? { ...booking, reviewed: true } : booking
      );
      localStorage.setItem('flightBookings', JSON.stringify(updatedBookings));

      navigate('/my-bookings');
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <h2>Leave a Review</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Rating:</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Your Review:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            minLength="10"
            maxLength="500"
            placeholder="Share your experience (10-500 characters)"
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}

export default ReviewForm;