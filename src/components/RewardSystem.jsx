import React, { useState, useEffect } from 'react';
import { FaGift } from 'react-icons/fa';
import './RewardSystem.css';

const RewardSystem = ({ user, bookings, balance }) => {
  const [eligibleReward, setEligibleReward] = useState(0);
  const [eligibleTickets, setEligibleTickets] = useState(0);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [cryptoBalance, setCryptoBalance] = useState({});
  const [message, setMessage] = useState('');
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const CRYPTO_CURRENCIES = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "BNB": "Binance Coin",
    "SOL": "Solana",
    "XRP": "Ripple",
    "ADA": "Cardano",
    "DOGE": "Dogecoin",
    "DOT": "Polkadot"
  };

  // Get eligible bookings from props
  const eligibleBookings = bookings.filter(
    booking => !booking.rewardClaimed && booking.status === 'Confirmed'
  );

  useEffect(() => {
    if (user) {
      calculateEligibleRewards();
      fetchCryptoBalances();
      checkClaimStatus();
      fetchTransactions();
    }
  }, [user, bookings]);

  const fetchTransactions = () => {
    try {
      const txData = JSON.parse(localStorage.getItem('transaction_history')) || [];
      setTransactions(txData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const checkClaimStatus = () => {
    const hasClaimedReward = transactions.some(
      tx => tx.type === 'reward' && tx.description.includes('Loyalty reward')
    );
    setHasClaimed(hasClaimedReward);
  };

  const calculateEligibleRewards = () => {
    try {
      const transactionEligible = transactions.filter(
        tx => tx.type === 'booking' && tx.rewardEligible && !tx.rewardClaimed
      );
      
      const allEligible = [...transactionEligible, ...eligibleBookings];
      const totalEligible = allEligible.reduce((sum, item) => sum + (item.amount || item.price), 0);
      const rewardAmount = allEligible.length > 0 ? Math.max(totalEligible * 0.02, 10) : 0;
      
      setEligibleReward(rewardAmount);
      setEligibleTickets(allEligible.length);
    } catch (error) {
      console.error('Error calculating rewards:', error);
    }
  };

  const fetchCryptoBalances = () => {
    try {
      const cryptoData = JSON.parse(localStorage.getItem('user_crypto')) || {};
      setCryptoBalance(cryptoData);
    } catch (error) {
      console.error('Error fetching crypto balances:', error);
    }
  };

  const handleConfirmClaim = async () => {
    setShowConfirmModal(false);
    await claimReward();
  };

  const claimReward = async () => {
    if (eligibleTickets === 0) {
      setMessage('No rewards available to claim');
      return;
    }

    if (hasClaimed) {
      setMessage('You have already claimed your rewards for these bookings');
      return;
    }

    setIsClaiming(true);
    try {
      // Mark bookings as claimed
      const updatedBookings = bookings.map(booking => {
        if (!booking.rewardClaimed && booking.status === 'Confirmed') {
          return { ...booking, rewardClaimed: true };
        }
        return booking;
      });
      localStorage.setItem('flightBookings', JSON.stringify(updatedBookings));
      
      // Mark transactions as claimed
      const updatedTransactions = transactions.map(tx => {
        if (tx.type === 'booking' && tx.rewardEligible && !tx.rewardClaimed) {
          return { ...tx, rewardClaimed: true };
        }
        return tx;
      });
      
      // Update crypto balance
      const cryptoData = JSON.parse(localStorage.getItem('user_crypto')) || {};
      const currentBalance = cryptoData[selectedCrypto] || 0;
      const cryptoAmount = eligibleReward / getCryptoPrice(selectedCrypto);
      cryptoData[selectedCrypto] = currentBalance + cryptoAmount;
      localStorage.setItem('user_crypto', JSON.stringify(cryptoData));
      
      // Add reward transaction
      const rewardTx = {
        id: `reward_${Date.now()}`,
        type: 'reward',
        amount: eligibleReward,
        date: new Date().toISOString(),
        description: `Loyalty reward in ${selectedCrypto}`,
        status: 'completed',
        crypto: selectedCrypto,
        cryptoAmount
      };
      
      const allTransactions = [...updatedTransactions, rewardTx];
      localStorage.setItem('transaction_history', JSON.stringify(allTransactions));
      setTransactions(allTransactions);
      
      // Update user balance
      const userData = JSON.parse(localStorage.getItem('travelgo_user')) || {};
      userData.balance = (userData.balance || 0) + eligibleReward;
      localStorage.setItem('travelgo_user', JSON.stringify(userData));
      
      setMessage(`Success! You received ${cryptoAmount.toFixed(8)} ${selectedCrypto}`);
      setHasClaimed(true);
      calculateEligibleRewards();
      fetchCryptoBalances();
    } catch (error) {
      console.error('Error claiming reward:', error);
      setMessage('Failed to claim reward');
    } finally {
      setIsClaiming(false);
    }
  };

  const getCryptoPrice = (crypto) => {
    const prices = {
      BTC: 60000,
      ETH: 3000,
      BNB: 500,
      SOL: 150,
      XRP: 0.5,
      ADA: 0.45,
      DOGE: 0.12,
      DOT: 7
    };
    return prices[crypto] || 1;
  };

  const calculateBookingReward = (bookingPrice) => {
    return Math.floor(bookingPrice * 0.02);
  };

  const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>{message}</p>
          <div className="modal-actions">
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onConfirm} className="confirm-button">Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="reward-system">
      <h2><FaGift /> Loyalty Rewards</h2>
      
      <div className="balance-section">
        <p>Available Balance: <strong>{balance} coins</strong></p>
        <p>Total Eligible Reward: <strong>{eligibleReward.toFixed(2)} coins</strong></p>
      </div>

      <div className="reward-card">
        <div className="reward-info">
          <h3>Claim Your Reward</h3>
          <p className="reward-amount">{eligibleReward.toFixed(2)} coins</p>
          <p>(2% of {eligibleTickets} ticket purchases)</p>
        </div>
        
        <div className="claim-section">
          <select 
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            className="crypto-select"
          >
            {Object.entries(CRYPTO_CURRENCIES).map(([code, name]) => (
              <option key={code} value={code}>{name} ({code})</option>
            ))}
          </select>
          
          <button 
            onClick={() => setShowConfirmModal(true)}
            disabled={eligibleReward <= 0 || hasClaimed || isClaiming}
            className="claim-button"
          >
            {isClaiming ? 'Claiming...' : hasClaimed ? 'Reward Claimed' : 'Claim All Rewards'}
          </button>
        </div>
      </div>

      {message && <div className="reward-message">{message}</div>}

      <div className="transaction-history">
        <h3>Reward History</h3>
        {transactions.filter(tx => tx.type === 'reward').map(tx => (
          <div key={tx.id} className="transaction-item">
            <p>{new Date(tx.date).toLocaleDateString()}</p>
            <p>+{tx.cryptoAmount.toFixed(8)} {tx.crypto}</p>
            <p>{tx.description}</p>
          </div>
        ))}
        {transactions.filter(tx => tx.type === 'reward').length === 0 && (
          <p>No reward history yet</p>
        )}
      </div>

      {eligibleBookings.length > 0 && (
        <div className="bookings-rewards">
          <h3>Eligible Bookings</h3>
          <div className="bookings-list">
            {eligibleBookings.map(booking => (
              <div key={booking.bookingId} className="booking-reward-item">
                <div className="booking-details">
                  <h4>Booking #{booking.bookingId}</h4>
                  <p>{booking.fromCity} → {booking.toCity}</p>
                  <p>Price: {booking.price} coins</p>
                  <p className="reward-amount">
                    Reward: +{calculateBookingReward(booking.price)} coins
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="crypto-balances">
        <h3>Your Crypto Holdings</h3>
        {Object.keys(CRYPTO_CURRENCIES).map(code => (
          cryptoBalance[code] > 0 && (
            <div key={code} className="crypto-item">
              <span className="crypto-name">{CRYPTO_CURRENCIES[code]}</span>
              <span className="crypto-amount">{cryptoBalance[code].toFixed(8)} {code}</span>
            </div>
          )
        ))}
        {Object.values(cryptoBalance).every(bal => bal <= 0) && (
          <p>No cryptocurrency holdings yet</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmClaim}
        onCancel={() => setShowConfirmModal(false)}
        message={`Are you sure you want to claim ${eligibleReward.toFixed(2)} coins as ${selectedCrypto}?`}
      />
    </div>
  );
};

export default RewardSystem;