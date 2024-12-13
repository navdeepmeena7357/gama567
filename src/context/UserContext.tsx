'use client';
import { profile } from '@/app/services/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserData {
  id: number;
  name: string;
  username: string;
  isVerified: number;
  isDepositAllowed: number;
  isWithdrawAllowed: number;
  status: number;
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData) => void;
  logoutUser: () => void;
  fetchAndSetUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);

  const saveUserData = (data: UserData) => {
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const fetchAndSetUser = async () => {
    try {
      const data = await profile();
      saveUserData({
        id: data.user.id,
        name: data.user.name,
        username: data.user.username,
        isVerified: data.user.is_verified,
        isDepositAllowed: data.user.is_deposit_allowed,
        isWithdrawAllowed: data.user.is_withdraw_allowed,
        status: data.user.status,
      });
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logoutUser();
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      fetchAndSetUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser: saveUserData, logoutUser, fetchAndSetUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
