/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import TitleBar from '@/components/TitleBar';
import { MarketData } from '@/app/page';
import { BASE_URL, BidResponse, BidsData } from '@/app/services/api';
import LoadingModal from '@/components/LoadingModal';
import NoResults from '@/components/NoResults';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';
import {
  Search,
  Calendar,
  Clock,
  Tag,
  Building,
  Award,
  Timer,
} from 'lucide-react';

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
    const istDate = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(today);

    // Convert from DD/MM/YYYY to DD-MM-YYYY
    return istDate.replace(/\//g, '-');
  };

  const formatToDDMMYYYY = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const formatToYYYYMMDD = (dateString: string) => {
    try {
      // Check if dateString is valid
      if (!dateString || typeof dateString !== 'string') {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      }

      // Split the date string
      const parts = dateString.split('-');

      // Check if we have exactly 3 parts
      if (parts.length !== 3) {
        throw new Error('Invalid date format');
      }

      const [day, month, year] = parts;

      // Validate day, month, and year
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (
        isNaN(dayNum) ||
        isNaN(monthNum) ||
        isNaN(yearNum) ||
        dayNum < 1 ||
        dayNum > 31 ||
        monthNum < 1 ||
        monthNum > 12 ||
        yearNum < 1900 ||
        yearNum > 2100
      ) {
        throw new Error('Invalid date values');
      }

      // Pad day and month with leading zeros if necessary
      const paddedDay = String(dayNum).padStart(2, '0');
      const paddedMonth = String(monthNum).padStart(2, '0');

      return `${yearNum}-${paddedMonth}-${paddedDay}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      // Return today's date as fallback
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
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

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      border: '1px solid #e2e8f0',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #f97316',
      },
      borderRadius: '0.5rem',
      padding: '2px',
    }),
    option: (base: any, state: { isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected ? '#f97316' : base.backgroundColor,
      '&:hover': {
        backgroundColor: '#fff7ed',
      },
    }),
  };

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
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);

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
  const BidCard = React.memo(({ bid }: { bid: BidsData }) => {
    const getStatusColor = () => {
      if (bid.is_win === null) return 'bg-yellow-50 text-yellow-600';
      return bid.is_win === 1
        ? 'bg-green-50 text-green-600'
        : 'bg-red-50 text-red-600';
    };

    const getStatusText = () => {
      if (bid.is_win === null) return 'Pending';
      return bid.is_win === 1 ? 'Win' : 'Lost';
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{bid.bet_date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-600" />
              <h3 className="font-medium">{bid.market_name}</h3>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${getStatusColor()} text-sm font-medium`}
          >
            {getStatusText()}
          </div>
        </div>

        {/* Details */}
        <div className="bg-orange-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium">
                {bid.bet_type.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <span className="text-sm font-medium">{bid.bet_digit}</span>
          </div>

          <div className="flex items-center justify-between border-t border-orange-100 pt-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span className="text-sm">Amount</span>
            </div>
            <span className="font-medium">₹{bid.bet_amount}</span>
          </div>
        </div>

        {/* Session */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Session</span>
          </div>
          <span className="font-medium">
            {bid.market_session.toUpperCase()}
          </span>
        </div>
      </div>
    );
  });

  const FilterSection = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Building className="w-4 h-4" />
            Market
          </label>
          <Select
            onChange={handleMarketIdChange}
            options={marketNameOptions}
            styles={customSelectStyles}
            placeholder="Select market..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Bid Type
          </label>
          <Select
            onChange={handleBidTypeChange}
            options={bidTypeOptions}
            styles={customSelectStyles}
            placeholder="Select type..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date
          </label>
          <input
            type="date"
            value={formatToYYYYMMDD(date)}
            onChange={handleDateChange}
            className="w-full rounded-lg border-gray-200 focus:border-orange-500 focus:ring-0 text-sm p-2.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Session
          </label>
          <Select
            onChange={handleSessionChange}
            options={sessionOptions}
            styles={customSelectStyles}
            placeholder="Select session..."
          />
        </div>
      </div>

      <button
        onClick={handleSearchBids}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 transition-colors duration-200"
      >
        <Search className="w-4 h-4" />
        Search Bids
      </button>
    </div>
  );

  return (
    <>
      <LoadingModal isOpen={isLoading} variant="pulse" />

      <div className="pb-20 mt-14">
        <TitleBar title="My Bids" />

        <div className="max-w-xl mx-auto p-4 space-y-4">
          <FilterSection />

          {bids.length > 0 ? (
            <div className="space-y-3">
              {bids.map((bid) => (
                <BidCard key={bid.id} bid={bid} />
              ))}
            </div>
          ) : visible ? (
            <NoResults />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default BidsPage;
