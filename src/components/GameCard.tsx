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

  // Dynamic styles based on status
  const getStatusStyles = () => {
    if (!isMarketOpen && !isMarketClose) {
      return {
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        border: 'border-purple-100',
        indicator: 'bg-red-400',
        text: 'text-red-500',
        label: 'Closed',
      };
    } else if (isMarketOpen && isMarketClose) {
      return {
        bg: 'bg-gradient-to-br from-purple-100 to-pink-100',
        border: 'border-purple-200',
        indicator: 'bg-emerald-400',
        text: 'text-emerald-600',
        label: 'Running',
      };
    } else if (!isMarketOpen && isMarketClose) {
      return {
        bg: 'bg-gradient-to-br from-pink-50 to-purple-50',
        border: 'border-pink-100',
        indicator: 'bg-amber-400',
        text: 'text-amber-600',
        label: 'Close Run',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-100',
      indicator: 'bg-red-400',
      text: 'text-red-500',
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
        className={`relative ${styles.bg} border ${styles.border} rounded-xl p-1
          transition-all duration-500 cursor-pointer
          hover:shadow-xl hover:shadow-purple-100
          active:scale-[0.98] overflow-hidden`}
      >
        {/* Status Indicator */}
        <div className="flex  items-center justify-between mb-2 pl-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${styles.indicator} animate-pulse`}
            />
            <span className={`text-xs font-medium ${styles.text}`}>
              {styles.label}
            </span>
          </div>
          {market.is_active && user?.isVerified ? (
            <div className="flex flex-col items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-400">Play</span>
            </div>
          ) : (
            <></>
          )}
        </div>

        {!user?.isVerified ? (
          <a
            href="/features/chart"
            className="flex bg-purple-500 flex-col items-center gap-1.5 p-2 rounded-sm"
          >
            <ChartAreaIcon className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white">View CHART</span>
          </a>
        ) : (
          <></>
        )}

        {/* Market Name */}
        <h2 className="text-lg font-semibold pl-2 text-purple-900 mb-2">
          {market.market_name}
        </h2>

        {/* Results Display */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 mb-2
          border border-purple-100 shadow-sm"
        >
          <div className="grid grid-cols-3 place-items-center text-purple-900">
            <div className="text-center">
              <p className="text-sm font-medium mb-1">{market.open_pana}</p>
            </div>
            <div className="text-center px-2 border-x border-purple-100">
              <p className="text-base font-semibold mb-1">
                {getLastDigitOfSum(market.open_pana)}-
                {getLastDigitOfSum(market.close_pana)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">{market.close_pana}</p>
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-2 p-2 flex justify-between items-center">
          <div className="flex items-center gap-3 text-purple-900">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-500">Opens</span>
            <p className="text-sm font-medium">
              {convertTo12HourFormat(market.market_open_time)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-purple-900">
            <Timer className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-500">Closes</span>
            <p className="text-sm font-medium">
              {convertTo12HourFormat(market.market_close_time)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;
