'use client';

import { BASE_URL } from '@/app/services/api';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import { getTokenFromLocalStorage } from '@/utils/basic';
import { showErrorToast } from '@/utils/toast';
import { useEffect, useState, useCallback } from 'react';
import LoadingModal from '@/components/LoadingModal';

interface Market {
  market_id: number;
  market_name: string;
}

interface ApiResponse<T> {
  status?: number;
  success?: boolean;
  games?: T;
  url?: string;
  message?: string;
}

const GameChart = () => {
  const [chartUrl, setChartUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  // Optimized API calls with error handling
  const fetchGameMarkets = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/marketsNames`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data: ApiResponse<Market[]> = await response.json();

      if (!response.ok) throw new Error('Failed to fetch markets');
      if (data.status !== 1)
        throw new Error(data.message || 'Unable to fetch markets');

      return data.games || [];
    } catch (error) {
      showErrorToast(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      return [];
    }
  }, []);

  const getGameChart = useCallback(
    async (marketId: number): Promise<string> => {
      try {
        const response = await fetch(`${BASE_URL}/game_chart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
          body: JSON.stringify({ id: marketId }),
        });

        const data: ApiResponse<never> = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Unable to get chart for the game');
        }

        return data.url || '';
      } catch (error) {
        showErrorToast(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'
        );
        return '';
      }
    },
    []
  );

  // Load initial data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const marketData = await fetchGameMarkets();
      setMarkets(marketData);

      if (marketData.length > 0) {
        setSelectedMarket(marketData[0]);
        const url = await getGameChart(marketData[0].market_id);
        setChartUrl(url);
      }
      setLoading(false);
    };

    initializeData();
  }, [fetchGameMarkets, getGameChart]);

  // Handle market selection
  const handleMarketChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = parseInt(event.target.value);
    const selected = markets.find((m) => m.market_id === selectedId);
    if (!selected) return;

    setSelectedMarket(selected);
    setLoading(true);
    const url = await getGameChart(selectedId);
    setChartUrl(url);
    setLoading(false);
  };

  return (
    <>
      <TitleBar title="Game Charts" />
      <SafeArea>
        <div className="px-4 py-6 max-w-5xl mx-auto">
          {/* Market Selection Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-red-200 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Select Market
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="marketSelect"
                className="block text-sm font-medium text-gray-600"
              >
                Choose a market to view its chart:
              </label>
              <select
                id="marketSelect"
                value={selectedMarket?.market_id || ''}
                onChange={handleMarketChange}
                className="w-full p-3 rounded-xl border-2 border-red-200
                  focus:border-red-400 focus:ring focus:ring-red-200
                  bg-white/50 backdrop-blur-sm transition-all duration-200
                  text-gray-700 font-medium outline-none"
              >
                {markets.map((market) => (
                  <option key={market.market_id} value={market.market_id}>
                    {market.market_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Display Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm overflow-hidden">
            {loading ? (
              <LoadingModal
                isOpen={true}
                variant="spinner"
                message="Loading chart..."
              />
            ) : chartUrl ? (
              <iframe
                src={chartUrl}
                title="Game Chart"
                className="w-full h-[calc(100vh-18rem)] border-0"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg font-medium">No chart available</p>
                <p className="text-sm">Please select a different market</p>
              </div>
            )}
          </div>
        </div>
      </SafeArea>
    </>
  );
};

export default GameChart;
