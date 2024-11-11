/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import TitleBar from '@/components/TitleBar';
import { MarketData } from '@/app/page';
import { BASE_URL, BidResponse, BidsData } from '@/app/services/api';
import LoadingModal from '@/components/LoadingModal';
import NoResults from '@/components/NoResults';
import Card from '@/components/Card';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';

const BidsPage = () => {
  const sessionOptions = [
    { value: 'open', label: 'OPEN' },
    { value: 'close', label: 'CLOSE' },
    { value: 'null', label: 'JODI' },
  ];

  const bidTypeOptions = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Jodi' },
    { value: 'single_panel', label: 'Single Pana' },
    { value: 'double_panel', label: 'Double Pana' },
    { value: 'triple_panel', label: 'Triple Pana' },
    { value: 'half_sangam', label: 'Half Sangam' },
    { value: 'full_sangam', label: 'Full Sangam' },
  ];

  const formatDateToFullMonth = (dateString: string) => {
    const [day, month, year] = dateString.split('-');

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const monthIndex = parseInt(month, 10) - 1;
    if (monthIndex < 0 || monthIndex > 11) {
      throw new Error('Invalid month number');
    }

    const monthName = monthNames[monthIndex];

    return `${parseInt(day, 10)}-${monthName}-${year}`;
  };

  const getCurrentDateFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const formatToDDMMYYYY = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const formatToYYYYMMDD = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
  };
  const [isLoading, setIsLoading] = useState(false);
  const [marketNameOptions, setMarketNameOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const [marketId, setMarketId] = useState<number>(0);
  const [bidType, setBidType] = useState('');
  const [session, setSession] = useState('');
  const [date, setDate] = useState<string>(getCurrentDateFormatted);
  const [bids, setBids] = useState<BidsData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const handleSearchBids = useCallback(async () => {
    setIsLoading(true);
    try {
      const requestBody: any = { user_id: getUserIdFromToken() };

      if (marketId) requestBody.market_id = marketId;
      if (bidType) requestBody.bid_type = bidType;
      if (session) requestBody.bid_session = session;
      if (date) requestBody.date = formatDateToFullMonth(date);

      const response = await fetch(`${BASE_URL}/user_bid_history_3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
        body: JSON.stringify({ requestBody }),
      });

      const result: BidResponse = await response.json();
      if (result.status === 1) {
        setBids(result.bidss);
        setVisible(result.bidss.length === 0);
      } else {
        console.error('Error fetching bids');
        setVisible(true);
      }
    } catch (error) {
      setVisible(true);
      console.error('Error fetching bids:', error);
    } finally {
      setIsLoading(false);
    }
  }, [marketId, bidType, session, date]);
  useEffect(() => {
    handleSearchBids();
  }, [handleSearchBids]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/markets`);
        const data: MarketData[] = await response.json();
        const options = data.map((game) => ({
          value: game.market_id,
          label: game.market_name,
        }));
        setMarketNameOptions(options);

        await handleSearchBids();
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [handleSearchBids]);

  const handleMarketIdChange = (selectedOption: any) => {
    setMarketId(selectedOption?.value || null);
  };

  const handleBidTypeChange = (selectedOption: any) => {
    setBidType(selectedOption?.value || null);
  };

  const handleSessionChange = (selectedOption: any) => {
    setSession(selectedOption?.value || null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatToDDMMYYYY(event.target.value);
    setDate(formattedDate);
  };

  // eslint-disable-next-line react/display-name
  const RenderBids = React.memo(() => {
    return (
      <>
        <div className="mt-4">
          <ul className="mt-2">
            {bids.map((bid) => (
              <li
                key={bid.id}
                className={`p-2 border-b border-s-4 flex justify-between items-center rounded ${bid.is_win === null ? 'border-s-yellow-500' : bid.is_win === 1 ? 'border-s-green-400' : 'border-s-red-400'}  border-gray-300 bg-white m-2`}
              >
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">{bid.bet_date}</div>
                  <div className="text-gray-600 font-medium text-sm">
                    {bid.market_name} - {bid.market_session.toUpperCase()}
                  </div>

                  <div className="inline-block bg-orange-50 p-2 shadow-sm shadow-gray-200 rounded-md">
                    <div className="font-medium text-sm">
                      {bid.bet_type.toUpperCase().replace('_', ' ')} -{' '}
                      {bid.bet_digit}
                    </div>
                    <div>
                      <h2 className="font-medium text-sm">
                        Amount : {bid.bet_amount}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-sm text-gray-500">Status</h1>
                  <h1
                    className={`font-medium ${bid.is_win === null ? 'text-yellow-500' : bid.is_win === 1 ? 'text-green-400' : 'text-red-400'}  border-gray-300 bg-white m-2`}
                  >
                    <h1>
                      {bid.is_win === null
                        ? 'Pending'
                        : bid.is_win === 1
                          ? 'Win'
                          : 'Lost'}
                    </h1>
                  </h1>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  });

  return (
    <>
      <LoadingModal isOpen={isLoading} />

      <div className="mt-[60px] justify-items-center text-center">
        <TitleBar title="My Bids" />

        <Card>
          <div className="flex justify-between text-start gap-2 m-2">
            <div className="w-full">
              <h1>Market</h1>
              <Select
                onChange={handleMarketIdChange}
                className="focus:ring-transparent mt-1 focus:outline-none focus:border-orange-500"
                options={marketNameOptions}
              />
            </div>

            <div className="w-full">
              <h1>Bid Type</h1>
              <Select
                onChange={handleBidTypeChange}
                className="focus:ring-transparent mt-1 focus:outline-none focus:border-orange-500"
                options={bidTypeOptions}
              />
            </div>
          </div>

          <div className="flex justify-between gap-2 m-2 text-start">
            <div className="w-full">
              <h1>Date</h1>
              <input
                type="date"
                value={formatToYYYYMMDD(date)}
                onChange={handleDateChange}
                className="focus:ring-transparent mt-1 max-w-[154px] p-2 bg-white rounded-sm shadow shadow-gray-400 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="w-full">
              <h1>Session</h1>
              <Select
                onChange={handleSessionChange}
                className="focus:ring-transparent mt-1 focus:outline-none focus:border-orange-500"
                options={sessionOptions}
              />
            </div>
          </div>

          <button
            onClick={handleSearchBids}
            className="w-44 justify-center mt-2 shadow-sm shadow-gray-300 text-center items-center p-2  ml-4 mr-4 bg-green-500 rounded-md text-white font-medium"
          >
            Search Bids
          </button>
        </Card>
      </div>

      <RenderBids />

      {visible && <NoResults />}
    </>
  );
};

export default BidsPage;
