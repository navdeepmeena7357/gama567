'use client';
import { useEffect, useState } from 'react';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import { BASE_URL } from '@/app/services/api';
import { convertTo12HourFormat } from '@/utils/time';

interface Market {
  market_name: string;
  market_open_time: string;
  market_close_time: string;
}

const Timetable = () => {
  const [markets, setMarkets] = useState<Market[]>([]);

  const fetchMarkets = async () => {
    try {
      const response = await fetch(`${BASE_URL}/markets_timetable`);
      const data = await response.json();
      if (data.status === 1) {
        setMarkets(data.games);
      } else {
        console.error('Failed to fetch markets');
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  return (
    <>
      <TitleBar title="Market Time Table" />
      <SafeArea>
        <div className="rounded-sm">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-pink-500 rounded-md text-white text-sm ">
                <th className="py-2 px-2">Market Name</th>
                <th className="py-2 px-2">Open Time</th>
                <th className="py-2 px-2">Close Time</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((market, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition duration-300"
                >
                  <td className="py-2 px-4">{market.market_name}</td>
                  <td className="py-2 px-4">
                    {convertTo12HourFormat(market.market_open_time)}
                  </td>
                  <td className="py-2 px-4">
                    {convertTo12HourFormat(market.market_close_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SafeArea>
    </>
  );
};

export default Timetable;
