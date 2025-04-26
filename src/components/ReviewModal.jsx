import React, { useState } from 'react';
import { generateReviewHash } from '../utils/reviewUtils';
import './ReviewModal.css';

const ReviewModal = ({ booking, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const reviewData = {
        userId: localStorage.getItem('travelgo_userId'),
        bookingId: booking.bookingId,
        destination: booking.toCity,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        userName: localStorage.getItem('travelgo_username') || 'Anonymous'
      };

      // Generate immutable hash
      reviewData.hash = generateReviewHash(reviewData);

      await onSubmit(reviewData);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Leave a Review</h2>
        <p>How was your trip to {booking.toCity}?</p>
        
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
            <label>Your Review:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
              rows="4"
            />
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;