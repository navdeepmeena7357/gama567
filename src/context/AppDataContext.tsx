// context/AppDataContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '@/app/services/api';

interface ContactDetails {
  id: number;
  phone_number: string;
  whatsapp_numebr: string;
  telegram: string;
  payment_address: string;
  min_bet: number;
  max_bet: number;
  banner_image: string;
  created_at: string | null;
  welcome_bonus: number;
  withdraw_close_time: string;
  withdraw_open_time: string;
  app_link: string;
  share_message: string;
  banner_message: string;
  telegram_link: string;
  how_to_play_link: string;
}

interface AppData {
  contactDetails: ContactDetails | null;
}

const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}/app_config`);
      const data: ContactDetails = await response.json();
      setContactDetails(data);
    };

    fetchData();
  }, []);

  return (
    <AppDataContext.Provider value={{ contactDetails }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
