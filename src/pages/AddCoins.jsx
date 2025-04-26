import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCoins.css';
import CryptoJS from 'crypto-js';
import { FaCoins, FaCheckCircle, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';

function AddCoins() {
  const [amount, setAmount] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleAddCoins = async (e) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 100) return;
    
    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate transaction data
      const timestamp = new Date().toISOString();
      const txId = `tx_${CryptoJS.SHA256(`${Date.now()}`).toString().substring(0, 12)}`;
      const txHash = CryptoJS.SHA256(`${amount}-${timestamp}`).toString();
      
      const newTransaction = {
        id: txId,
        hash: txHash,
        type: 'deposit',
        amount: parseInt(amount),
        date: timestamp,
        description: 'Coin Deposit',
        status: 'completed'
      };

      // Update user balance in localStorage
      const userData = JSON.parse(localStorage.getItem('travelgo_user')) || {};
      userData.balance = (userData.balance || 0) + parseInt(amount);
      localStorage.setItem('travelgo_user', JSON.stringify(userData));

      // Save transaction to history
      const txHistory = JSON.parse(localStorage.getItem('transaction_history')) || [];
      txHistory.unshift(newTransaction);
      localStorage.setItem('transaction_history', JSON.stringify(txHistory));

      setTransaction(newTransaction);
      
    } catch (error) {
      console.error('Error adding coins:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="add-coins-container">
      <div className="add-coins-glass">
        <button className="back-button" onClick={() => navigate('/wallet')}>
          <FaArrowLeft /> Back to Wallet
        </button>

        <h1><FaCoins className="gold-coin-icon" /> Add Travel Coins</h1>
        
        {!transaction ? (
          <form onSubmit={handleAddCoins} className="add-coins-form">
            <div className="form-group">
              <label htmlFor="amount">Amount to Add</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  step="100"
                  required
                  placeholder="Enter amount"
                />
                <span className="currency">coins</span>
              </div>
              <p className="hint">Minimum deposit: 100 coins (increments of 100)</p>
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isProcessing || !amount || parseInt(amount) < 100}
            >
              {isProcessing ? 'Processing...' : 'Add Coins'}
            </button>
          </form>
        ) : (
          <div className="confirmation-section">
            <FaCheckCircle className="success-icon" />
            <h2>Deposit Successful!</h2>
            <div className="transaction-details">
              <div className="detail-row">
                <span className="detail-label">Amount Added:</span>
                <span className="detail-value">+{transaction.amount} coins</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Transaction ID:</span>
                <span className="detail-value">{transaction.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {new Date(transaction.date).toLocaleString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className="detail-value status-completed">
                  {transaction.status}
                </span>
              </div>
            </div>
            <div className="action-buttons">
              <button 
                className="action-button primary"
                onClick={() => navigate('/book-ticket')}
              >
                Book Travel Now
              </button>
              <button 
                className="action-button secondary"
                onClick={() => {
                  setTransaction(null);
                  setAmount('');
                }}
              >
                Add More Coins
              </button>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3><FaInfoCircle /> About Travel Coins</h3>
          <ul>
            <li>1 coin = ₹1 in booking value</li>
            <li>Use coins for all travel bookings</li>
            <li>Earn 2% crypto rewards on every booking</li>
            <li>Coins never expire</li>
            <li>Minimum deposit: 100 coins</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddCoins;