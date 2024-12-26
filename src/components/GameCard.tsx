import React, { useState } from 'react';
import { ChartAreaIcon, Clock, PlayCircle, Timer } from 'lucide-react';
import { convertTo12HourFormat } from '@/utils/time';
import { getLastDigitOfSum } from '@/utils/basic';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AlertModal from './AlertModal';
import { useUser } from '@/context/UserContext';

interface MarketProps {
  market: {
    id: number;
    market_id: number;
    market_name: string;
    open_pana: string;
    close_pana: string;
    market_open_time: string;
    market_close_time: string;
    is_active: number;
    open_market_status: number;
    close_market_status: number;
  };
}

const GameCard: React.FC<MarketProps> = ({ market }) => {
  const router = useRouter();
  const { user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Keeping your existing click handlers and validation logic
  const handleMarketClick = () => {
    const queryParams = new URLSearchParams({
      id: market.id.toString(),
      market_id: market.market_id.toString(),
      name: market.market_name,
      is_active: market.is_active.toString(),
      open_status: market.open_market_status.toString(),
      close_status: market.close_market_status.toString(),
    });
    if (user?.isVerified) {
      router.push(`/game?${queryParams.toString()}`);
    } else {
      handleOpenModal(
        `${market.market_name} : ${market.market_open_time} | ${market.market_close_time}`
      );
    }
  };

  const isMarketOpen = market.open_market_status === 1;
  const isMarketClose = market.close_market_status === 1;

  const getStatusStyles = () => {
    if (!isMarketOpen && !isMarketClose) {
      return {
        bg: 'bg-red-50',
        border: 'border-pink-200',
        indicator: 'bg-red-500',
        text: 'text-red-600',
        label: 'Closed',
      };
    } else if (isMarketOpen && isMarketClose) {
      return {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        indicator: 'bg-green-500',
        text: 'text-green-600',
        label: 'Running',
      };
    } else if (!isMarketOpen && isMarketClose) {
      return {
        bg: 'bg-red-50',
        border: 'border-pink-200',
        indicator: 'bg-amber-500',
        text: 'text-amber-600',
        label: 'Close Run',
      };
    }
    return {
      bg: 'bg-red-50',
      border: 'border-pink-200',
      indicator: 'bg-red-500',
      text: 'text-red-600',
      label: 'Closed',
    };
  };

  const handleOpenModal = (message: string) => {
    setAlertMessage(message);
    setModalOpen(true);
  };

  const styles = getStatusStyles();

  return (
    <>
      {isModalOpen && (
        <AlertModal
          message={alertMessage}
          onClose={() => setModalOpen(false)}
        />
      )}
      <Toaster position="bottom-center" reverseOrder={false} />

      <div
        onClick={
          user?.isVerified
            ? (isMarketOpen && isMarketClose) || isMarketClose
              ? handleMarketClick
              : () =>
                  handleOpenModal('Market is closed for today. Try Tomorrow')
            : undefined
        }
        className={`${styles.bg} border ${styles.border} rounded-xl p-3
          transition-all duration-200 cursor-pointer shadow-sm
          hover:shadow-md hover:border-pink-300 active:scale-[0.99]`}
      >
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className={`h-2 w-2 rounded-full ${styles.indicator} animate-pulse`}
            />
            <span className={`text-xs font-medium ${styles.text}`}>
              {styles.label}
            </span>
          </div>
          {market.is_active && user?.isVerified && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <PlayCircle className="w-3 h-3" />
              Play
            </div>
          )}
        </div>

        {/* Chart Button for Non-Verified Users */}
        {!user?.isVerified && (
          <a
            href="/features/chart"
            className="flex bg-gradient-to-r from-red-500 to-pink-500 items-center justify-center gap-1 py-1 rounded text-white mb-2"
          >
            <ChartAreaIcon className="w-3 h-3" />
            <span className="text-xs font-medium">View CHART</span>
          </a>
        )}

        {/* Market Name */}
        <h2 className="text-sm font-semibold text-red-900 mb-2">
          {market.market_name}
        </h2>

        {/* Results Display */}
        <div className="bg-white rounded-lg p-2 mb-2 border border-pink-100">
          <div className="grid grid-cols-3 place-items-center gap-1">
            <div className="text-center">
              <p className="text-xs font-medium text-red-800">
                {market.open_pana}
              </p>
            </div>
            <div className="text-center px-2 border-x border-pink-100">
              <p className="text-sm font-bold text-red-900">
                {getLastDigitOfSum(market.open_pana)}-
                {getLastDigitOfSum(market.close_pana)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-red-800">
                {market.close_pana}
              </p>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-white rounded-lg p-2 border border-pink-100">
          <div className="flex items-center gap-1 text-red-800">
            <Clock className="w-3 h-3 text-red-400" />
            <span className="text-pink-500">Opens:</span>
            <span className="font-medium">
              {convertTo12HourFormat(market.market_open_time)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-red-800">
            <Timer className="w-3 h-3 text-red-400" />
            <span className="text-pink-500">Closes:</span>
            <span className="font-medium">
              {convertTo12HourFormat(market.market_close_time)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;
