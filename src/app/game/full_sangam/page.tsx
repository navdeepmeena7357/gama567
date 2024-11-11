'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMarketInfo, Market } from '@/app/services/api';
import { MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { useUser } from '@/context/UserContext';
import { postBids } from '@/app/services/api';
import { useWallet } from '@/context/WalletContext';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import { FaArrowUpLong } from 'react-icons/fa6';

const FullSangam = () => {
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
  const [openPana, setOpenPana] = useState('');
  const [closePana, setClosePana] = useState('');
  const [amount, setAmount] = useState('');
  const [session, setSession] = useState<string>('');

  const handleAddBid = () => {
    if (session && openPana && amount && closePana) {
      const newBid = {
        market_session: 'null',
        bet_digit: openPana + closePana,
        bet_amount: Number(amount),
        bet_type: 'full_sangam',
        user_id: Number(user.user?.id),
        market_id: Number(market?.market_id),
      };
      setBids((prevBids) => [...prevBids, newBid]);
      setOpenPana('');
      setClosePana('');
      setAmount('');
    } else {
      showErrorToast('Please Enter Panas or Amount');
    }
  };

  const handleDeleteBid = (index: number) => {
    const updatedBids = bids.filter((_, i) => i !== index);
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
        showErrorToast('Error : ' + err);
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
      market_session: 'null',
      bet_digit: bid.bet_digit,
      bet_amount: bid.bet_amount,
      bet_type: 'full_sangam',
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
    <div className="mt-10 p-4">
      <Toaster position="bottom-center" reverseOrder={false} />

      {market && (
        <>
          <div className="flex justify-between items-center mt-2">
            <h1>Enter Open Pana</h1>

            <div className="justify-between flex items-center p-1">
              <input
                type="number"
                value={openPana}
                placeholder="Open Pana"
                maxLength={3}
                onChange={(e) => {
                  setOpenPana(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (['e', '.', '-', '+'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="rounded-lg shadow-lg max-w-[150px] p-2 text-center border-none focus:ring-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-1">
            <h1>Enter Close Pana</h1>

            <div className=" justify-between flex items-center p-1">
              <input
                type="number"
                value={closePana}
                placeholder="Close Pana"
                maxLength={3}
                onChange={(e) => {
                  setClosePana(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (['e', '.', '-', '+'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="rounded-lg shadow-lg max-w-[150px] p-2 text-center border-none focus:ring-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-1">
            <h1>Enter Points</h1>
            <div className=" justify-between flex items-center p-1">
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

          <div className="flex justify-end items-center pt-2 text-end">
            <button
              onClick={handleAddBid}
              className="bg-green-500 min-w-40 p-2 text-sm text-white rounded flex items-center justify-center gap-2"
            >
              <FaPlus />
              Add Bid
            </button>
          </div>

          <div className="shadow-md rounded-md mt-2 overflow-y-auto mb-14">
            <table className="min-w-full bg-green-500  table-auto text-center">
              <thead>
                <tr className="border-b text-white text-sm">
                  <th className="p-2 font-normal">Sangam</th>
                  <th className="p-2 font-normal">Point</th>
                  <th className="p-2 font-normal">Session</th>
                  <th className="p-2 font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {bids.map((bid, index) => (
                  <tr key={index} className="text-sm">
                    <td className="p-2 text-black">{bid.bet_digit}</td>
                    <td className="p-2">{bid.bet_amount}</td>
                    <td className="p-2 uppercase">SANGAM</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDeleteBid(index)}
                        className="text-red-500"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-md p-2 pl-4 pr-4">
            <div className="flex justify-between items-center">
              <div className="p-1 items-center text-sm space-y-1">
                <p>Total Bids: {totalCount}</p>
                <p>Total Amount: {totalAmount}</p>
              </div>
              <button
                onClick={handleSubmitBids}
                className="p-3 font-medium bg-green-500 text-white flex items-center gap-2 text-[14px] rounded"
              >
                <FaArrowUpLong />
                Submit Bids
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <FullSangam />
    </Suspense>
  );
};

export default Page;
