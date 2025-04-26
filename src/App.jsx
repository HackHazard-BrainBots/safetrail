import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import Navbar from './components/NavBar';
import BookTicket from './pages/BookTicket';
import Wallet from './pages/Wallet';
import AddCoins from './pages/AddCoins';
import Login from './pages/LogIn';
import SignUp from './pages/SignUp';
import CryptoWallet from './pages/CryptoWallet';
import BookingConfirmation from './pages/BookingConfirmation';
import ItineraryPlanner from './components/ItineraryPlanner';
import MyBookings from './pages/MyBookings';
import ReviewForm from './components/ReviewForm';
import RewardSystem from './components/RewardSystem';
import { AuthProvider } from './context/AuthContext';

function App() {
  // Initialize all required localStorage items
  useEffect(() => {
    const initializeLocalStorage = (key, defaultValue) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    };

    initializeLocalStorage('flightBookings', []);
    initializeLocalStorage('travelReviews', []);
    initializeLocalStorage('user_crypto', {});
    initializeLocalStorage('transaction_history', []);
    initializeLocalStorage('crypto_rewards', []);
    initializeLocalStorage('saved_itineraries', []);
    initializeLocalStorage('user_wallet', { balance: 0, transactions: [] });
    
    if (!localStorage.getItem('travelgo_user')) {
      localStorage.setItem('travelgo_user', JSON.stringify({
        username: '',
        email: '',
        balance: 1000,
        cryptoBalance: 0
      }));
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book-ticket" element={<BookTicket />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/crypto-wallet" element={<CryptoWallet />} />
            <Route path="/add-coins" element={<AddCoins />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/review/:bookingId" element={<ReviewForm />} />
            <Route path="/itinerary-planner" element={<ItineraryPlanner />} />
            <Route path="/rewards" element={<RewardSystem />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;