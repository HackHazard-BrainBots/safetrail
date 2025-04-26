import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const bookings = JSON.parse(localStorage.getItem('flightBookings')) || [];

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You don't have any bookings yet.</p>
          <button onClick={() => navigate('/book-ticket')}>Book a Flight</button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, index) => (
            <div key={index} className="booking-card">
              <h3>{booking.airline} - {booking.bookingId}</h3>
              <p>From: {booking.fromCity} ({booking.fromAirport})</p>
              <p>To: {booking.toCity} ({booking.toAirport})</p>
              <p>Date: {booking.departureDate}</p>
              <p>Passengers: {booking.passengers}</p>
              <p>Status: {booking.status}</p>
              {booking.canReview && (
                <button 
                  onClick={() => navigate(`/review/${booking.bookingId}`)}
                  className="review-button"
                >
                  Leave Review
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;