import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CryptoWallet.css';
import { 
  FaCoins, 
  FaHistory, 
  FaExchangeAlt, 
  FaArrowDown,
} from 'react-icons/fa';
import { GiCrystalGrowth } from 'react-icons/gi';
import { SiRipple, SiSolana, SiTether } from 'react-icons/si';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';

// Crypto data with icons and conversion rates (example rates)
const CRYPTOS = {
  BTC: {
    name: 'Bitcoin',
    icon: <FaBitcoin style={{ color: '#f7931a' }} />,
    rate: 0.0000025,
    color: '#f7931a'
  },
  ETH: {
    name: 'Ethereum',
    icon: <FaEthereum style={{ color: '#627eea' }} />,
    rate: 0.000015,
    color: '#627eea'
  },
  USDT: {
    name: 'Tether',
    icon: <SiTether style={{ color: '#26a17b' }} />,
    rate: 0.012,
    color: '#26a17b'
  },
  XRP: {
    name: 'XRP',
    icon: <SiRipple style={{ color: '#27a2db' }} />,
    rate: 0.2,
    color: '#27a2db'
  },
  SOL: {
    name: 'Solana',
    icon: <SiSolana style={{ color: '#00ffa3' }} />,
    rate: 0.004,
    color: '#00ffa3'
  }
};

const COIN_TO_INR = 1;

function CryptoWallet() {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    isLoading: true,
    error: null,
    selectedCrypto: 'BTC',
    cryptoBalances: {},
    cryptoRates: {}
  });
  const [activeTab, setActiveTab] = useState('balance');
  const navigate = useNavigate();

  const totalRewardsInCrypto = (walletData.balance * COIN_TO_INR * walletData.cryptoRates[walletData.selectedCrypto] || 0).toFixed(6);

  const coinsToCrypto = (coins) => {
    return (coins * COIN_TO_INR * walletData.cryptoRates[walletData.selectedCrypto] || 0).toFixed(6);
  };

  const coinsToSpecificCrypto = (coins, crypto) => {
    return (coins * COIN_TO_INR * walletData.cryptoRates[crypto] || 0).toFixed(6);
  };

  const fetchCryptoRates = async () => {
    try {
      const rates = {};
      Object.keys(CRYPTOS).forEach(crypto => {
        const fluctuation = 1 + (Math.random() * 0.1 - 0.05);
        rates[crypto] = CRYPTOS[crypto].rate * fluctuation;
      });
      return rates;
    } catch (err) {
      console.error('Error fetching crypto rates:', err);
      return Object.keys(CRYPTOS).reduce((acc, crypto) => {
        acc[crypto] = CRYPTOS[crypto].rate;
        return acc;
      }, {});
    }
  };

  const fetchWalletData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('travelgo_user')) || {};
      const transactions = JSON.parse(localStorage.getItem('crypto_rewards')) || [];
      const cryptoBalances = JSON.parse(localStorage.getItem('crypto_balances')) || {};
      
      Object.keys(CRYPTOS).forEach(crypto => {
        if (!cryptoBalances[crypto]) {
          cryptoBalances[crypto] = 0;
        }
      });

      const cryptoRates = await fetchCryptoRates();

      setWalletData({
        balance: userData.cryptoBalance || 0,
        transactions,
        isLoading: false,
        error: null,
        selectedCrypto: userData.preferredCrypto || 'BTC',
        cryptoBalances,
        cryptoRates
      });
    } catch (err) {
      console.error('Error fetching crypto wallet data:', err);
      setWalletData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load crypto wallet data'
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

  const handleCryptoChange = (e) => {
    const selectedCrypto = e.target.value;
    setWalletData(prev => ({ ...prev, selectedCrypto }));
    
    const userData = JSON.parse(localStorage.getItem('travelgo_user')) || {};
    userData.preferredCrypto = selectedCrypto;
    localStorage.setItem('travelgo_user', JSON.stringify(userData));
  };

  if (walletData.isLoading) {
    return (
      <div className="crypto-wallet">
        <div className="glass-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading crypto wallet data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (walletData.error) {
    return (
      <div className="crypto-wallet">
        <div className="glass-container">
          <div className="error-message">
            <p>{walletData.error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crypto-wallet">
      <div className="glass-container">
        <div className="wallet-header">
          <h1>
            <GiCrystalGrowth /> Multi-Crypto Wallet
          </h1>
          <p>Earn and manage multiple cryptocurrency rewards</p>
        </div>

        <div className="wallet-nav">
          <button 
            className={`nav-button ${activeTab === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveTab('balance')}
          >
            <FaCoins /> Portfolio
          </button>
          <button 
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> History
          </button>
          <button 
            className="refresh-button"
            onClick={handleRefresh}
            title="Refresh balance"
          >
            <FaExchangeAlt />
          </button>
        </div>

        {activeTab === 'balance' ? (
          <>
            <div className="balance-section">
              <div className="balance-card">
                <h2>Total Crypto Portfolio Value</h2>
                <div className="balance-amount">
                  ₹{(walletData.balance).toFixed(2)}
                  <div className="currency">
                    ≈ {totalRewardsInCrypto} {walletData.selectedCrypto}
                  </div>
                </div>
                <div className="wallet-info">
                  <div className="crypto-selector">
                    <label>Preferred Reward Currency:</label>
                    <select 
                      value={walletData.selectedCrypto}
                      onChange={handleCryptoChange}
                      className="crypto-dropdown"
                    >
                      {Object.keys(CRYPTOS).map(crypto => (
                        <option key={crypto} value={crypto}>
                          {CRYPTOS[crypto].name} ({crypto})
                        </option>
                      ))}
                    </select>
                  </div>
                  <p>Earn 2% crypto rewards on every booking!</p>
                  <p>Current conversion: 1 Coin = ₹1.00</p>
                </div>
              </div>
            </div>

            <div className="crypto-portfolio">
              <h2>Your Crypto Assets</h2>
              <div className="crypto-grid">
                {Object.keys(CRYPTOS).map(crypto => (
                  <div 
                    key={crypto} 
                    className="crypto-card"
                    style={{ 
                      '--crypto-color': CRYPTOS[crypto].color,
                      '--crypto-bg': `${CRYPTOS[crypto].color}20`
                    }}
                  >
                    <div className="crypto-header">
                      <div className="crypto-icon" style={{ color: CRYPTOS[crypto].color }}>
                        {CRYPTOS[crypto].icon}
                      </div>
                      <div>
                        <h3>{CRYPTOS[crypto].name}</h3>
                        <span className="crypto-symbol">{crypto}</span>
                      </div>
                    </div>
                    <div className="crypto-balance" style={{ color: CRYPTOS[crypto].color }}>
                      {coinsToSpecificCrypto(walletData.balance, crypto)}
                    </div>
                    <div className="crypto-value">
                      ≈ ₹{(walletData.balance * COIN_TO_INR).toFixed(2)}
                    </div>
                    <div className="crypto-rate">
                      1 {crypto} = ₹{(1 / walletData.cryptoRates[crypto]).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="transaction-section">
            <h2>Rewards History</h2>
            {walletData.transactions.length === 0 ? (
              <div className="empty-transactions">
                <p>No Rewards Yet</p>
                <p>Start booking flights to earn crypto rewards!</p>
                <p>Your earned rewards will appear here</p>
              </div>
            ) : (
              <div className="transaction-list">
                {walletData.transactions.map((tx) => {
                  const cryptoData = CRYPTOS[tx.crypto || walletData.selectedCrypto];
                  const cryptoAmount = coinsToSpecificCrypto(tx.amount, tx.crypto || walletData.selectedCrypto);
                  
                  return (
                    <div 
                      key={tx.id} 
                      className="transaction-item"
                      style={{ '--tx-color': cryptoData.color }}
                    >
                      <div 
                        className="tx-icon"
                        style={{ color: cryptoData.color }}
                      >
                        {cryptoData.icon}
                      </div>
                      <div className="tx-details">
                        <div className="tx-header">
                          <p className="tx-description">{tx.description}</p>
                          <div className="tx-amount-container">
                            <p 
                              className="tx-amount"
                              style={{ color: cryptoData.color }}
                            >
                              +{tx.amount.toFixed(2)} Coins
                            </p>
                            <p 
                              className="tx-crypto-amount"
                              style={{ color: cryptoData.color }}
                            >
                              ≈ {cryptoAmount} {tx.crypto || walletData.selectedCrypto}
                            </p>
                          </div>
                        </div>
                        <div className="tx-footer">
                          <span className="tx-date">
                            {new Date(tx.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="tx-status completed">
                            {tx.status || 'completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CryptoWallet;