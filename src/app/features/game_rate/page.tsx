'use client';
import React, { useEffect, useState } from 'react';
import { getGameRates } from '@/app/services/api';
import { showErrorToast } from '@/utils/toast';
import TitleBar from '@/components/TitleBar';
import SafeArea from '@/components/SafeArea';
import LoadingModal from '@/components/LoadingModal';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react';

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
          }
          return rate;
        });
        setGameRates(updatedRates);
      } catch (error) {
        showErrorToast('An error occurred : ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameRates();
  }, []);

  const getRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBackgroundGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-blue-50 to-blue-100',
      'bg-gradient-to-r from-purple-50 to-purple-100',
      'bg-gradient-to-r from-green-50 to-green-100',
      'bg-gradient-to-r from-orange-50 to-orange-100',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <>
      <LoadingModal isOpen={isLoading} variant="pulse" />
      <TitleBar title="Game Rate" />

      <SafeArea>
        <div className="p-4 space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6" />
              <h1 className="text-xl font-bold">Win Ratio Guide</h1>
            </div>
            <p className="text-sm opacity-90">
              Check current winning rates for all game types. Rates shown are
              per 10.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Highest Rate
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-green-700">
                {gameRates
                  ? Math.max(...gameRates.map((r) => Number(r.market_rate)))
                  : '-'}
                x
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Total Games
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-blue-700">
                {gameRates?.length || 0}
              </p>
            </div>
          </div>

          {/* Rates List */}
          {gameRates && (
            <div className="space-y-3">
              {gameRates.map((rate, index) => {
                const winAmount = Number(rate.market_rate) * 10;
                return (
                  <div
                    key={rate.id}
                    className={`
                      rounded-xl p-4 transition-all duration-200
                      hover:shadow-md hover:scale-[1.01]
                      ${getBackgroundGradient(index)}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {rate.market_name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Base : 10
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${getRateColor(winAmount)}`}
                        >
                          ₹{winAmount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {rate.market_rate}x return
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SafeArea>
    </>
  );
};

export default GameRate;
