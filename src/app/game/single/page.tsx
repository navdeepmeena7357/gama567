'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMarketInfo, Market } from '@/app/services/api';
import { MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import DropdownSelect from '@/components/SessionDropdown';
import { postBids } from '@/app/services/api';
import { useWallet } from '@/context/WalletContext';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import { FaArrowUpLong } from 'react-icons/fa6';
import SafeArea from '@/components/SafeArea';

const SinglePage = () => {
  const searchParams = useSearchParams();
  const user = useUser();

  const { balance, refreshBalance } = useWallet();

  const id = searchParams.get('id');

  interface Bid {
    market_session: string;
    bet_digit: string;
    bet_amount: number;
    bet_type: string;
    user_id: number;
    market_id: number;
  }

  const [market, setMarket] = useState<Market | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [digit, setDigit] = useState('');
  const [amount, setAmount] = useState('');
  const [session, setSession] = useState<string>('');

  const openOptions = [
    {
      value: 'open',
      label: `OPEN`,
      disabled: market?.open_market_status !== 1,
    },
    {
      value: 'close',
      label: `CLOSE`,
      disabled: false,
    },
  ];

  const closeOptions = [
    {
      value: 'close',
      label: `CLOSE`,
      disabled: false,
    },
  ];

  const options = market?.open_market_status === 1 ? openOptions : closeOptions;

  const handleAddBid = () => {
    if (Number(amount) > 0 && Number(amount) >= 10) {
      if (session && digit && amount) {
        const newBid = {
          market_session: session,
          bet_digit: digit,
          bet_amount: Number(amount),
          bet_type: 'single',
          user_id: Number(user.user?.id),
          market_id: Number(market?.market_id),
        };
        setBids((prevBids) => [...prevBids, newBid]);
        console.log(JSON.stringify(bids));
        setDigit('');
        setAmount('');
      } else {
        showErrorToast('Please Enter Digit or Amount');
      }
    } else {
      showErrorToast('Minimum bid amount  is 10 !');
    }
  };

  const handleDeleteBid = (index: number) => {
    const updatedBids = bids.filter((_, i) => i !== index);
    setBids(updatedBids);
  };

  const handleSelectChange = (value: string) => {
    setSession(value);

    const updatedBids = bids.map((bid) => ({
      ...bid,
      market_session: value,
    }));

    setBids(updatedBids);
  };

  const totalAmount = bids.reduce((acc, bid) => acc + bid.bet_amount, 0);
  const totalCount = bids.length;

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = await getMarketInfo(Number(id));
        setMarket(data);
        if (data.open_market_status === 1) {
          setSession('open');
        } else {
          setSession('close');
        }
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
      bet_type: 'single',
      user_id: Number(user.user?.id),
      market_id: Number(market?.market_id),
    }));

    try {
      const response = await postBids(formattedBids);
      if (response.success) {
        showSuccessToast(response.error_msg);
        setBids([]);
      } else {
        console.error(response.error_msg);
        showErrorToast(response.error_msg);
      }
      refreshBalance();
    } catch (error) {
      console.error(error);
      showSuccessToast('Something went wrong !' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster position="bottom-center" reverseOrder={false} />
      <SafeArea>
        {market && (
          <div className="max-w-3xl mx-auto px-4">
            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                {/* Session Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Session
                  </label>

                  <DropdownSelect
                    options={options}
                    onChange={handleSelectChange}
                  />
                </div>

                {/* Digit Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Digit
                  </label>
                  <input
                    type="number"
                    value={digit}
                    placeholder="0-9"
                    maxLength={1}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]?$/.test(value)) {
                        setDigit(value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['e', '.', '-', '+'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:border-red-500 text-center"
                  />
                </div>

                {/* Points Input */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Points
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    maxLength={4}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyDown={(e) => {
                      if (['e', '.', '-', '+'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:border-red-500 text-center"
                  />
                </div>

                {/* Add Bid Button */}
                <button
                  onClick={handleAddBid}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-md p-2 flex items-center justify-center gap-2 transition-colors"
                >
                  <FaPlus className="text-sm" />
                  <span className="font-medium text-sm">Add Bid</span>
                </button>
              </div>
            </div>

            {/* Bids Table */}
            <div className="bg-white rounded-lg shadow-sm mt-4 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-sm font-medium">Digit</th>
                    <th className="py-3 px-4 text-sm font-medium">Points</th>
                    <th className="py-3 px-4 text-sm font-medium">Session</th>
                    <th className="py-3 px-4 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 text-sm hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-center">{bid.bet_digit}</td>
                      <td className="py-3 px-4 text-center">
                        {bid.bet_amount}
                      </td>
                      <td className="py-3 px-4 text-center uppercase">
                        {bid.market_session}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteBid(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <MdDelete className="h-5 w-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <p className="text-sm text-gray-600">
                  Total Bids:{' '}
                  <span className="font-medium text-gray-900">
                    {totalCount}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Total Amount:{' '}
                  <span className="font-medium text-gray-900">
                    {totalAmount}
                  </span>
                </p>
              </div>
              <button
                onClick={handleSubmitBids}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 flex items-center gap-2 transition-colors"
              >
                <FaArrowUpLong />
                <span className="font-medium text-sm">Submit Bids</span>
              </button>
            </div>
          </div>
        </div>
      </SafeArea>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <SinglePage />
    </Suspense>
  );
};

export default Page;
