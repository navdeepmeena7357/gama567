'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useWallet } from '@/context/WalletContext';
import { getMarketInfo, Market, postBids } from '@/app/services/api';
import { Toaster } from 'react-hot-toast';
import DropdownSelect from '@/components/SessionDropdown';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import { FaArrowUpLong } from 'react-icons/fa6';
import { redJodi } from '@/utils/numbers';

interface Bid {
  market_session: string;
  bet_digit: string;
  bet_amount: number;
  bet_type: string;
  user_id: number;
  market_id: number;
}

const RedJodi = () => {
  const searchParams = useSearchParams();
  const user = useUser();
  const { balance, refreshBalance } = useWallet();
  const id = searchParams.get('id');

  const [market, setMarket] = useState<Market | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [amount, setAmount] = useState('');
  const [session, setSession] = useState<string>('');

  const options = [
    {
      value: 'null',
      label: `JODI`,
    },
  ];

  const totalAmount = bids.reduce((acc, bid) => acc + bid.bet_amount, 0);
  const totalCount = bids.length;

  const handleSelectChange = (value: string) => {
    setSession(value);

    const updatedBids = bids.map((bid) => ({
      ...bid,
      market_session: value,
    }));

    setBids(updatedBids);
  };

  const handleNumberClick = (digit: string) => {
    if (Number(amount) > 0) {
      const existingBidIndex = bids.findIndex((bid) => bid.bet_digit === digit);

      if (existingBidIndex !== -1) {
        const updatedBids = [...bids];
        updatedBids[existingBidIndex].bet_amount += Number(amount);
        setBids(updatedBids);
      } else {
        const newBid: Bid = {
          market_session: session,
          bet_digit: digit,
          bet_amount: Number(amount),
          bet_type: 'double',
          user_id: Number(user.user?.id),
          market_id: Number(market?.market_id),
        };
        setBids([...bids, newBid]);
      }
    } else {
      showErrorToast('Please Enter Points !');
    }
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await getMarketInfo(Number(id));
        setMarket(data);
        setSession('null');
      } catch (err) {
        throw err;
      }
    };
    fetchMarketData();
  }, [id]);

  const handleSubmitBids = async () => {
    if (bids.length === 0) {
      showErrorToast('Please Add Bids to Submit');
      return;
    }

    if (balance < totalAmount) {
      showErrorToast('Not Enough Wallet Balance');
      return;
    }

    const formattedBids = bids.map((bid) => ({
      market_session: bid.market_session,
      bet_digit: bid.bet_digit,
      bet_amount: bid.bet_amount,
      bet_type: 'double',
      user_id: Number(user.user?.id),
      market_id: Number(market?.market_id),
    }));

    try {
      const response = await postBids(formattedBids);

      if (response.success) {
        showSuccessToast(response.error_msg);
        setBids([]);
        setAmount('');
        refreshBalance();
      } else {
        showErrorToast(response.error_msg);
      }
    } catch (error) {
      showSuccessToast('Something went wrong !');
      throw error;
    }
  };

  return (
    <>
      <div className="mt-12 p-4">
        <Toaster position="bottom-center" reverseOrder={false} />

        <div className="flex justify-between items-center">
          <h1>Select Session</h1>
          <DropdownSelect
            options={options}
            defaultOption={session}
            onChange={handleSelectChange}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <h1>Enter Points : </h1>
          <div className="justify-between flex items-center p-1">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              maxLength={4}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => {
                if (['e', '.', '-', '+'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="rounded-lg shadow-lg max-w-[150px] p-2 text-center border-none focus:ring-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 mt-4 gap-2 justify-items-center mb-14">
          {redJodi
            .slice()
            .sort((a, b) => Number(a) - Number(b))
            .map((digit) => {
              const existingBid = bids.find((bid) => bid.bet_digit === digit);

              return (
                <div
                  key={digit}
                  className="relative bg-orange-500 pt-6 pb-6 pl-8 pr-8 rounded-md text-white font-semibold text-center items-center"
                  onClick={() => handleNumberClick(digit)}
                >
                  {digit}

                  {existingBid && (
                    <span className="absolute right-0 bottom-0  bg-white rounded w-full border border-orange-500 text-black font-bold text-sm flex justify-center items-center">
                      {existingBid.bet_amount}
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-md p-2 pl-4 pr-4">
          <div className="flex justify-between items-center">
            <div className="p-1 items-center text-sm space-y-1">
              <p>Total Bids: {totalCount}</p>
              <p>Total Amount: {totalAmount}</p>
            </div>
            <button
              onClick={handleSubmitBids}
              className="p-3 font-medium bg-orange-500 text-white flex items-center gap-2 text-[14px] rounded"
            >
              <FaArrowUpLong />
              Submit Bids
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Page = () => {
  return (
    <Suspense>
      <RedJodi />
    </Suspense>
  );
};

export default Page;
