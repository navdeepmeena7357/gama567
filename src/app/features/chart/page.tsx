'use client';

import { BASE_URL } from '@/app/services/api';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import { getTokenFromLocalStorage } from '@/utils/basic';
import { showErrorToast } from '@/utils/toast';
import { useEffect, useState } from 'react';

async function fetchGameMarkets() {
  try {
    const response = await fetch(`${BASE_URL}/marketsNames`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 1) {
        return data.games;
      } else {
        showErrorDialog('Unable to fetch markets');
        return [];
      }
    } else {
      showErrorDialog('Unable to fetch markets');
      return [];
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorDialog(error.message);
    } else {
      showErrorDialog('An unexpected error occurred');
    }
    return [];
  }
}

async function getGameChart(marketId: number): Promise<string> {
  const body = {
    id: marketId,
  };

  try {
    const response = await fetch(`${BASE_URL}/game_chart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      if (data.success) {
        return data.url;
      } else {
        showErrorDialog('Unable to get chart for the game');
        return 'Cannot load market chart';
      }
    } else {
      showErrorDialog('Unable to get chart for the game');
      return 'Cannot load market chart';
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      showErrorToast(error.message);
    } else {
      showErrorToast('An unexpected error occurred');
    }
    return 'Cannot load market chart';
  }
}

const GameChart = () => {
  const [chartUrl, setChartUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [marketId, setMarketId] = useState<number>(0);
  const [markets, setMarkets] = useState<
    { market_id: number; market_name: string }[]
  >([]);

  const fetchChart = async (id: number) => {
    setLoading(true);
    const url = await getGameChart(id);
    setChartUrl(url);
    setLoading(false);
  };

  useEffect(() => {
    const loadMarkets = async () => {
      const marketData = await fetchGameMarkets();
      setMarkets(marketData);
      if (marketData.length > 0) {
        fetchChart(marketData[0].market_id);
      }
    };
    loadMarkets();
  }, []);

  const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMarketId = parseInt(event.target.value);
    setMarketId(selectedMarketId);
    fetchChart(selectedMarketId);
  };

  return (
    <>
      <TitleBar title="Game Charts" />
      <SafeArea>
        <div className="">
          <h2 className="pr-4 pl-4 text-2xl font-semibold text-orange-600">
            Select Market
          </h2>
          <div className="p-4">
            <label
              htmlFor="marketSelect"
              className="block text-sm font-medium text-gray-700"
            >
              Choose a market to view its chart:
            </label>
            <select
              id="marketSelect"
              value={marketId}
              onChange={handleMarketChange}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-orange-300"
            >
              {markets.map((market) => (
                <option key={market.market_id} value={market.market_id}>
                  {market.market_name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <h1 className="text-center text-gray-500">Loading...</h1>
          ) : (
            <div className=" h-full">
              {chartUrl ? (
                <iframe
                  src={chartUrl}
                  title="Game Chart"
                  className=" w-full h-[calc(100vh-8rem)] border-0"
                ></iframe>
              ) : (
                <h1 className="text-center text-gray-500">
                  No chart available
                </h1>
              )}
            </div>
          )}
        </div>
      </SafeArea>
    </>
  );
};
export default GameChart;
function showErrorDialog(arg0: string) {
  throw new Error('Function not implemented.' + arg0);
}
