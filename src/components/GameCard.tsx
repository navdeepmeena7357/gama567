import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
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
  const isRunning = market.is_active && isMarketOpen;

  let statusMessage = '';
  let bgGradient = '';
  let borderColor = '';
  let statusColor = '';

  if (!isMarketOpen && !isMarketClose) {
    statusMessage = 'CLOSED';
    bgGradient = 'from-rose-950 to-red-900';
    borderColor = 'border-red-800/30';
    statusColor = 'text-red-400';
  } else if (isMarketOpen && isMarketClose) {
    statusMessage = 'RUNNING';
    bgGradient = 'from-emerald-900 to-emerald-800';
    borderColor = 'border-emerald-700/30';
    statusColor = 'text-emerald-400';
  } else if (!isMarketOpen && isMarketClose) {
    statusMessage = 'CLOSE RUN';
    bgGradient = 'from-amber-700 to-amber-800';
    borderColor = 'border-amber-600/30';
    statusColor = 'text-amber-400';
  } else {
    statusMessage = 'CLOSED';
    bgGradient = 'from-rose-950 to-red-900';
    borderColor = 'border-red-800/30';
    statusColor = 'text-red-400';
  }

  const handleOpenModal = (message: string) => {
    setAlertMessage(message);
    setModalOpen(true);
  };

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
        className={`relative overflow-hidden bg-gradient-to-r ${bgGradient} p-2.5 rounded-xl
          border ${borderColor} group
          transition-all duration-300 cursor-pointer
          hover:scale-[1.01] active:scale-[0.98]
          shadow-lg shadow-black/20`}
      >
        {/* Shine Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
        />

        {/* Header */}
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h2 className="text-sm font-bold text-white mb-0.5 italic">
              {market.market_name}
            </h2>
            {user?.isVerified ? (
              <span
                className={`text-[10px] font-bold tracking-wider ${statusColor} uppercase italic`}
              >
                {statusMessage}
              </span>
            ) : (
              <></>
            )}
          </div>

          {user?.isVerified ? (
            <button
              className={`p-1.5 rounded-lg ${
                isRunning
                  ? 'bg-emerald-400/90 hover:bg-emerald-400'
                  : 'bg-red-500/90 hover:bg-red-500'
              } backdrop-blur-sm transition-all duration-200 shadow-md`}
            >
              {market.is_active ? (
                <Play className="w-3 h-3 text-white" />
              ) : (
                <X className="w-3 h-3 text-white" />
              )}
            </button>
          ) : (
            <></>
          )}
        </div>

        {/* Numbers Display */}
        <div
          className="bg-black/30 backdrop-blur-sm rounded-lg p-2 mb-2 
          border border-white/20 group-hover:bg-black/40 transition-colors"
        >
          <div className="flex items-center justify-center gap-2 text-white font-bold italic">
            <span className="text-xs">{market.open_pana}</span>
            <span className="text-sm">-</span>
            <span className="text-sm">
              {getLastDigitOfSum(market.open_pana)}
            </span>
            <span className="text-sm">
              {getLastDigitOfSum(market.close_pana)}
            </span>
            <span className="text-sm">-</span>
            <span className="text-xs">{market.close_pana}</span>
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-2 gap-2">
          <div
            className="bg-black/30 backdrop-blur-sm rounded-lg p-2 
            border border-white/20 group-hover:bg-black/40 transition-colors"
          >
            <h3 className="text-white/90 text-[10px] font-medium mb-0.5 italic uppercase">
              Open Bids
            </h3>
            <p className="text-white text-xs font-bold italic">
              {convertTo12HourFormat(market.market_open_time)}
            </p>
          </div>
          <div
            className="bg-black/30 backdrop-blur-sm rounded-lg p-2 
            border border-white/20 group-hover:bg-black/40 transition-colors"
          >
            <h3 className="text-white/90 text-[10px] font-medium mb-0.5 italic uppercase">
              Close Bids
            </h3>
            <p className="text-white text-xs font-bold italic">
              {convertTo12HourFormat(market.market_close_time)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameCard;
