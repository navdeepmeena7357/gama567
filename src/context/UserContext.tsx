'use client';
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

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser: saveUserData, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
