import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wallet.css';
import { FaCoins, FaHistory, FaArrowRight, FaPlus, FaExchangeAlt } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { BsCoin } from 'react-icons/bs';

function Wallet() {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    cryptoBalance: 0,
    cryptoTransactions: [],
    stats: {
      totalDeposits: 0,
      totalSpent: 0,
      totalRewards: 0
    },
    isLoading: true,
    error: null
  });
  const [activeTab, setActiveTab] = useState('balance');
  const navigate = useNavigate();

  const fetchWalletData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('travelgo_user')) || {};
      const transactions = JSON.parse(localStorage.getItem('transaction_history')) || [];
      const cryptoTransactions = JSON.parse(localStorage.getItem('crypto_rewards')) || [];
      
      // Filter out crypto rewards from transactions
      const coinTransactions = transactions.filter(tx => tx.type !== 'reward');
      
      const stats = {
        totalDeposits: coinTransactions
          .filter(tx => tx.type === 'deposit')
          .reduce((sum, tx) => sum + tx.amount, 0),
        totalSpent: Math.abs(coinTransactions
          .filter(tx => tx.type === 'booking')
          .reduce((sum, tx) => sum + tx.amount, 0)),
        totalRewards: cryptoTransactions
          .reduce((sum, tx) => sum + tx.amount, 0)
      };

      setWalletData({
        balance: userData.balance || 0,
        transactions: coinTransactions,
        cryptoBalance: userData.cryptoBalance || 0,
        cryptoTransactions,
        stats,
        isLoading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setWalletData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load wallet data'
      }));
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      fetchWalletData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleRefresh = async () => {
    setWalletData(prev => ({ ...prev, isLoading: true }));
    await fetchWalletData();
  };

  if (walletData.isLoading) {
    return (
      <div className="wallet-container">
        <div className="wallet-glass">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading wallet data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (walletData.error) {
    return (
      <div className="wallet-container">
        <div className="wallet-glass">
          <div className="error-message">
            <p>{walletData.error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-glass">
        <div className="wallet-header">
          <h1>Coin Wallet</h1>
          <div className="wallet-tabs">
            <button 
              className={`tab-button ${activeTab === 'balance' ? 'active' : ''}`}
              onClick={() => setActiveTab('balance')}
            >
              <FaCoins /> Balance
            </button>
            <button 
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FaHistory /> Transactions
            </button>
            <button 
              className="refresh-button"
              onClick={handleRefresh}
              title="Refresh balance"
            >
              <FaExchangeAlt />
            </button>
          </div>
        </div>

        {activeTab === 'balance' ? (
          <div className="balance-section">
            <div className="balance-card">
              <div className="balance-header">
                <h2>Available Balance</h2>
                <BsCoin className="coin-icon" />
              </div>
              <div className="balance-amount">
                <span className="amount">{walletData.balance.toFixed(2)}</span>
                <span className="currency">coins</span>
              </div>
              <div className="wallet-actions">
                <button 
                  className="action-button primary"
                  onClick={() => navigate('/add-coins')}
                >
                  <FaPlus /> Add Coins
                </button>
                <button 
                  className="action-button secondary"
                  onClick={() => navigate('/book-ticket')}
                >
                  Book Travel
                </button>
              </div>
            </div>

            <div className="quick-stats">
              <div className="stat-card">
                <div className="stat-header">
                  <GiCash className="stat-icon deposit" />
                  <h3>Total Deposits</h3>
                </div>
                <p className="positive">+{walletData.stats.totalDeposits.toFixed(2)} coins</p>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <FaExchangeAlt className="stat-icon spent" />
                  <h3>Total Spent</h3>
                </div>
                <p className="negative">-{walletData.stats.totalSpent.toFixed(2)} coins</p>
              </div>
              <div className="stat-card">
                <div className="stat-header">
                  <FaCoins className="stat-icon reward" />
                  <h3>Total Rewards</h3>
                </div>
                <p className="positive">+{walletData.stats.totalRewards.toFixed(6)} crypto</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="history-section">
            <h2>Transaction History</h2>
            {walletData.transactions.length === 0 ? (
              <div className="no-transactions">
                <p>No transactions yet</p>
                <button 
                  className="action-button primary"
                  onClick={() => navigate('/add-coins')}
                >
                  <FaPlus /> Add Coins
                </button>
              </div>
            ) : (
              <div className="transactions-list">
                {walletData.transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className={`transaction-item ${tx.type}`}
                    style={{ '--tx-color': tx.type === 'deposit' ? '#2ecc71' : '#e74c3c' }}
                  >
                    <div className="transaction-icon">
                      {tx.type === 'deposit' ? 
                        <FaArrowRight className="incoming" /> : 
                        <FaArrowRight className="outgoing" />}
                    </div>
                    <div className="transaction-details">
                      <h3>{tx.description}</h3>
                      <div className="transaction-meta">
                        <span className="transaction-date">
                          {new Date(tx.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className={`transaction-status ${tx.status}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                    <div className={`transaction-amount ${tx.type}`}>
                      {tx.type === 'deposit' ? '+' : '-'}
                      {Math.abs(tx.amount).toFixed(2)} coins
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;