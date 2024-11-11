'use client';
import TitleBar from '@/components/TitleBar';
import React, { useEffect, useState } from 'react';
import { getGameRates } from '@/app/services/api';
import LoadingModal from '@/components/LoadingModal';
import { showErrorToast } from '@/utils/toast';
import SafeArea from '@/components/SafeArea';

interface GameRates {
  id: number;
  market_name: string;
  market_rate: string;
}
const GameRate = () => {
  const [gameRates, setGameRates] = useState<GameRates[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGameRates = async () => {
      try {
        setIsLoading(true);
        const rates: GameRates[] = await getGameRates();
        const updatedRates = rates.map((rate) => {
          if (rate.market_name === 'Single') {
            return { ...rate, market_rate: '9.5' };
          } else if (rate.market_name === 'Double') {
            return { ...rate, market_name: 'Jodi' };
          } else {
            return rate;
          }
        });
        setGameRates(updatedRates);
      } catch (error) {
        setIsLoading(false);
        showErrorToast('An error occurred : ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameRates();
  }, []);

  return (
    <>
      <LoadingModal isOpen={isLoading} />

      <TitleBar title="Game Rate" />
      <SafeArea>
        <h1 className="text-white bg-green-600 rounded-md p-2 ml-3 mr-3 text-center font-semibold">
          Game Win Ratio for All Bids
        </h1>
        {gameRates && (
          <ul className="text-black p-4">
            {gameRates.map((rate) => (
              <li
                key={rate.id}
                className="p-2 flex font-medium justify-between bg-gray-100 shadow-sm shadow-gray-300 my-2 rounded-md"
              >
                {rate.market_name}
                <div>
                  ₹10 - ₹
                  {(Number(rate.market_rate) * 10).toLocaleString('en-IN')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </SafeArea>
    </>
  );
};

export default GameRate;
