'use client';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import React, { useState, useEffect } from 'react';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import LoadingModal from '@/components/LoadingModal';
import { BASE_URL } from '@/app/services/api';
import Card from '@/components/Card';
import WithdrawHistoryCard from '@/components/WithdrawHistoryCard';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';
import NoResults from '@/components/NoResults';

interface Withdrawal {
  id: number;
  user_id: string;
  request_message: string;
  request_amount: string;
  payment_number: string;
  request_status: string;
  created_at: string;
  updated_at: string;
}

const WithdrawFundHistory = () => {
  const [transactions, setTransactions] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = getTokenFromLocalStorage();
        if (!token) {
          showErrorToast('No token found. Please log in again.');
          return;
        }

        const response = await fetch(`${BASE_URL}/withdraw_request_history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: getUserIdFromToken() }),
        });

        const data: Withdrawal[] = await response.json();

        if (response.ok) {
          setTransactions(data);
          setVisible(data.length === 0);
        } else {
          showErrorToast('Failed to fetch transactions.');
        }
      } catch (err) {
        showSuccessToast('An error occurred while fetching transactions.');
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
      <LoadingModal isOpen={loading} />
      <TitleBar title="Withdraw History" />
      <SafeArea>
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            <Card>
              <WithdrawHistoryCard
                date={transaction.created_at}
                status={transaction.request_status}
                amount={parseFloat(transaction.request_amount)}
                txnType="Debit"
                withdrawMode={transaction.payment_number}
              />
            </Card>
          </div>
        ))}
        {visible && <NoResults />}
      </SafeArea>
    </>
  );
};

export default WithdrawFundHistory;
