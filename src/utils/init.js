// src/utils/init.js
export function initializeApp() {
    const defaults = {
      user_crypto: {},
      transaction_history: [],
      travelgo_user: {
        username: '',
        balance: 1000,
        passwordHash: '',
        rewardedTransactions: []
      },
      flightBookings: [],
      travelReviews: []
    };
  
    Object.entries(defaults).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });
  }