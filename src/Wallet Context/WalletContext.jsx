// src/context/WalletContext.jsx
import React, { createContext, useState, useContext } from 'react';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(1000); // Initial balance
  const [transactions, setTransactions] = useState([]);

  const addTransaction = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateBalance = (amount) => {
    setBalance(prev => prev + amount);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, updateBalance, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};