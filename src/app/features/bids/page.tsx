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
  ChevronRight,
} from 'lucide-react';

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    borderColor: '#e9d5ff',
    '&:hover': { borderColor: '#d8b4fe' },
    boxShadow: 'none',
    '&:focus-within': {
      borderColor: '#c084fc',
      boxShadow: '0 0 0 1px #c084fc',
    },
  }),
  option: (base: any, state: { isSelected: boolean; isFocused: boolean }) => ({
    ...base,
    backgroundColor: state.isSelected
      ? '#c084fc'
      : state.isFocused
        ? '#f3e8ff'
        : undefined,
    ':active': { backgroundColor: '#c084fc' },
  }),
};

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
    return `${parseInt(day, 10)}-${monthNames[monthIndex]}-${year}`;
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
    Array<{ value: number; label: string }>
  >([]);
  const [marketId, setMarketId] = useState<number | null>(null);
  const [bidType, setBidType] = useState<string>('');
  const [session, setSession] = useState<string>('');
  const [date, setDate] = useState<string>(getCurrentDateFormatted());
  const [bids, setBids] = useState<BidsData[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  const handleSearchBids = useCallback(async () => {
    setIsLoading(true);
    try {
      const requestBody = {
        user_id: getUserIdFromToken(),
        market_id: marketId,
        bid_type: bidType,
        bid_session: session,
        date: formatDateToFullMonth(date),
      };

      const response = await fetch(`${BASE_URL}/user_bid_history_3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result: BidResponse = await response.json();
      setBids(result.status === 1 ? result.bidss : []);
      setVisible(!result.bidss?.length);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setVisible(true);
      setBids([]);
    } finally {
      setIsLoading(false);
    }
  }, [marketId, bidType, session, date]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/markets`);
        const data: MarketData[] = await response.json();
        setMarketNameOptions(
          data.map((game) => ({
            value: game.market_id,
            label: game.market_name,
          }))
        );
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  useEffect(() => {
    handleSearchBids();
  }, [handleSearchBids]);

  const handleMarketIdChange = (selectedOption: any) => {
    setMarketId(selectedOption?.value ?? null);
  };

  const handleBidTypeChange = (selectedOption: any) => {
    setBidType(selectedOption?.value ?? '');
  };

  const handleSessionChange = (selectedOption: any) => {
    setSession(selectedOption?.value ?? '');
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(formatToDDMMYYYY(event.target.value));
  };

  // eslint-disable-next-line react/display-name
  const BidCard = React.memo(({ bid }: { bid: BidsData }) => {
    const getStatusStyles = () => {
      if (bid.is_win === null)
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-600',
          border: 'border-purple-100',
        };
      return bid.is_win === 1
        ? {
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            border: 'border-emerald-100',
          }
        : {
            bg: 'bg-pink-50',
            text: 'text-pink-600',
            border: 'border-pink-100',
          };
    };

    const styles = getStatusStyles();

    return (
      <div
        className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 space-y-4
        hover:shadow-md transition-shadow duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{bid.bet_date}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-900">
              <Building className="w-4 h-4" />
              <h3 className="font-semibold">{bid.market_name}</h3>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${styles.bg} ${styles.text} 
            text-sm font-medium border ${styles.border}`}
          >
            {bid.is_win === null
              ? 'Pending'
              : bid.is_win === 1
                ? 'Win'
                : 'Lost'}
          </div>
        </div>

        {/* Details */}
        <div
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 space-y-3
          border border-purple-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                {bid.bet_type.toUpperCase().replace('_', ' ')}
              </span>
            </div>
            <span className="text-sm font-semibold text-purple-900">
              {bid.bet_digit}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-purple-200 pt-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-900">Amount</span>
            </div>
            <span className="font-semibold text-purple-900">
              ₹{bid.bet_amount}
            </span>
          </div>
        </div>

        {/* Session */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-purple-600">
            <Clock className="w-4 h-4" />
            <span>Session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-purple-900">
              {bid.market_session.toUpperCase()}
            </span>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </div>
        </div>
      </div>
    );
  });

  const FilterSection = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
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
          <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-600" />
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
          <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Date
          </label>
          <input
            type="date"
            value={formatToYYYYMMDD(date)}
            onChange={handleDateChange}
            className="w-full rounded-lg border-purple-200 focus:border-purple-400 
              focus:ring-purple-400 text-sm p-2.5"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
            <Timer className="w-4 h-4 text-purple-600" />
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
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 
          hover:from-purple-600 hover:to-pink-600
          text-white rounded-xl py-3 px-4 
          flex items-center justify-center gap-2 
          transition-all duration-300 shadow-sm
          hover:shadow-md active:scale-[0.98]"
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
            <div className="space-y-4">
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
