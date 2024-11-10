'use client';

import { BASE_URL } from '@/app/services/api';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface PaymentDetails {
  id: number;
  upi_id: string;
  min_amount: number;
  max_amount: number;
  payment_desc: string;
  business_name: string;
  withdrawal_time_title: string;
  min_withdrawal: number;
  merchant_code: string;
  max_withdrawal: number;
}

interface PaymentContextType {
  paymentDetails: PaymentDetails | null;
  isLoading: boolean;
  errorPay: string | null;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorPay, setErrorPay] = useState<string | null>(null);

  const fetchPaymentDetails = async (url: string) => {
    setIsLoading(true);
    setErrorPay(null);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: PaymentDetails = await response.json();
      setPaymentDetails(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorPay(error.message);
      } else {
        setErrorPay('Failed to fetch payment details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const API_URL = `${BASE_URL}/payment_details`;
    fetchPaymentDetails(API_URL);
  }, []);

  return (
    <PaymentContext.Provider value={{ paymentDetails, isLoading, errorPay }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
