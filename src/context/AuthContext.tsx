'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import jwt from 'jsonwebtoken';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (isLocalStorageItemNotEmpty()) {
      setIsAuthenticated(true);
    }
  }, []);

  const authenticate = (token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_id', getSubFromToken(token));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function isLocalStorageItemNotEmpty() {
  const token = localStorage.getItem('token');
  return token !== null && token !== '';
}

const getSubFromToken = (token: string): string => {
  try {
    const decodedToken = jwt.decode(token) as jwt.JwtPayload;
    return decodedToken?.sub ?? 'null';
  } catch (error) {
    console.error('Error decoding token:', error);
    return 'null';
  }
};
