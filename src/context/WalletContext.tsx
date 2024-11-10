'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '@/app/services/api';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';

interface WalletData {
  balance: number;
  refreshBalance: () => void;
}

const WalletContext = createContext<WalletData | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [balance, setBalance] = useState<number>(0);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user_points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
        body: JSON.stringify({ user_id: getUserIdFromToken() }),
      });

      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.log(error);
      setBalance(0);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const refreshBalance = () => {
    fetchBalance();
  };

  return (
    <WalletContext.Provider value={{ balance, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
