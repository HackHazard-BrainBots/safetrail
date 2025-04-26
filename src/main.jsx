import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'; // External CSS
import { initializeApp } from './utils/init';
initializeApp();

// Initialize crypto storage if it doesn't exist
if (!localStorage.getItem('user_crypto')) {
  localStorage.setItem('user_crypto', JSON.stringify({}));
}

// Initialize transaction history if it doesn't exist
if (!localStorage.getItem('transaction_history')) {
  localStorage.setItem('transaction_history', JSON.stringify([]));
}

// Initialize user data if it doesn't exist
if (!localStorage.getItem('travelgo_user')) {
  localStorage.setItem('travelgo_user', JSON.stringify({
    username: '',
    balance: 1000, // Starting balance
    passwordHash: '',
    rewardedTransactions: []
  }));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);