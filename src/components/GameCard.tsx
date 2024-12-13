import React, { useState } from 'react';
import { convertTo12HourFormat } from '@/utils/time';
import { getLastDigitOfSum } from '@/utils/basic';
import { FaPlay } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CgClose } from 'react-icons/cg';
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

  let marketStatusMessage;
  let statusClass;
  let buttonClass;

  if (!isMarketOpen && !isMarketClose) {
    statusClass = 'text-red-600';
    buttonClass = 'bg-red-500';
    marketStatusMessage = 'Market Closed';
  } else if (isMarketOpen && isMarketClose) {
    marketStatusMessage = 'Market is Running';
    buttonClass = 'bg-green-500';
    statusClass = 'text-green-600';
  } else if (!isMarketOpen && isMarketClose) {
    marketStatusMessage = 'Running for Close';
    buttonClass = 'bg-green-500';
    statusClass = 'text-green-600';
  } else {
    statusClass = 'text-red-600';
    marketStatusMessage = 'Market is Closed';
  }

  const handleOpenModal = (message: string) => {
    setAlertMessage(message);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const showMarketClosed = () => {
    handleOpenModal('Market is closed for today. Try Tomorrow');
  };

  const isRunning = market.is_active && isMarketOpen;

  // Dynamic classes based on market status
  const cardBgClass = isRunning
    ? 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200'
    : 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200';

  const titleClass = isRunning ? 'text-green-800' : 'text-red-800';
  const numbersClass = isRunning ? 'text-green-600' : 'text-red-600';
  const timeClass = isRunning ? 'text-green-700' : 'text-red-700';

  return (
    <>
      {isModalOpen && (
        <AlertModal message={alertMessage} onClose={handleCloseModal} />
      )}
      <Toaster position="bottom-center" reverseOrder={false} />

      <div
        key={market.id}
        className={`${cardBgClass} transition-all duration-300 shadow-lg rounded-lg p-3 m-2`}
        onClick={
          user?.isVerified
            ? (isMarketOpen && isMarketClose) || isMarketClose
              ? () => handleMarketClick()
              : () => showMarketClosed()
            : undefined
        }
      >
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h2 className={`text-base font-bold ${titleClass} mb-1`}>
              {market.market_name}
            </h2>

            <div className="bg-white rounded-md p-2 mb-2 shadow-sm">
              <div className="flex items-center justify-center space-x-1 font-bold">
                <p className={`${numbersClass} text-sm`}>{market.open_pana}</p>
                <p className={`${numbersClass} text-lg`}>
                  - {getLastDigitOfSum(market.open_pana)}
                </p>
                <p className={`${numbersClass} text-lg`}>
                  {getLastDigitOfSum(market.close_pana)} -
                </p>
                <p className={`${numbersClass} text-sm`}>{market.close_pana}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-md p-1.5 text-center shadow-sm">
                <h3 className="text-gray-600 font-medium">Open Bids</h3>
                <p className={timeClass}>
                  {convertTo12HourFormat(market.market_open_time)}
                </p>
              </div>

              <div className="bg-white rounded-md p-1.5 text-center shadow-sm">
                <h3 className="text-gray-600 font-medium">Close Bids</h3>
                <p className={timeClass}>
                  {convertTo12HourFormat(market.market_close_time)}
                </p>
              </div>
            </div>
          </div>

          {user?.isVerified ? (
            <div className="flex flex-col items-center ml-2">
              <h1 className={`text-xs font-medium ${statusClass} mb-1`}>
                {marketStatusMessage}
              </h1>

              <div
                className={`flex items-center justify-center h-10 w-10 ${
                  isRunning ? 'bg-green-500 hover:bg-green-600' : buttonClass
                } rounded-full shadow-md transition-transform hover:scale-105`}
              >
                {market.is_active ? (
                  <FaPlay className="text-white text-sm" />
                ) : (
                  <CgClose className="text-white text-sm" />
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default GameCard;
