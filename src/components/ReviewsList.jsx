import React from 'react';
import { validateReviewHash } from '../utils/reviewUtils';
import './ReviewsList.css';

const ReviewsList = ({ reviews }) => {
  // Filter out invalid reviews (tampered with)
  const validReviews = reviews.filter(review => validateReviewHash(review));

  return (
    <div className="reviews-container">
      <h3>Travel Reviews</h3>
      
      {validReviews.length === 0 ? (
        <p className="no-reviews">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="reviews-list">
          {validReviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-header">
                <span className="review-rating">{review.rating} ★</span>
                <span className="review-date">
                  {new Date(review.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-meta">
                <span className="review-booking">Booking: {review.bookingId}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;