'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import { MdWallet } from 'react-icons/md';
import {
  Receipt,
  HomeIcon,
  Wallet,
  MessageCircle,
  BadgeIndianRupee,
} from 'lucide-react';
import { BASE_URL } from './services/api';
import { useWallet } from '@/context/WalletContext';
import { useAppData } from '@/context/AppDataContext';
import { useUser } from '@/context/UserContext';

import ProtectedRoute from '@/components/ProctectedRoute';
import LoadingModal from '@/components/LoadingModal';
import GameCard from '@/components/GameCard';
import Drawer from '@/components/Drawer';
import WalletOptions from '@/components/WalletOptions';
import Marquee from '@/components/Marquee';
import ContactRefresh from '@/components/ContactRefresh';

export interface MarketData {
  id: number;
  market_id: number;
  market_name: string;
  open_pana: string;
  close_pana: string;
  open_market_status: number;
  close_market_status: number;
  market_status: number;
  market_open_time: string;
  market_close_time: string;
  is_active: number;
  saturday_status: number;
  sunday_status: number;
}

const Navbar: React.FC<{ refreshMarketData: () => void }> = ({
  refreshMarketData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const appData = useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const wallet = useWallet();
  const { user, fetchAndSetUser } = useUser();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchAndSetUser();
      setIsLoading(false);
    })();

    (async () => {
      setIsLoading(true);
      refreshMarketData();
      setIsLoading(false);
    })();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchAndSetUser();
      refreshMarketData();
      wallet.refreshBalance();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-red-500 to-red-600 fixed top-0 left-0 right-0 z-30">
      <div className="px-3 py-2 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 hover:bg-red-400/50 rounded-lg transition-colors"
            >
              <HiOutlineMenuAlt1 className="h-6 w-6 text-white" />
            </button>

            <h1 className="text-xl font-bold text-white">
              KALYAN <span className="text-yellow-300">99</span>
            </h1>
          </div>
          {user?.isVerified ? (
            <div className="flex items-center gap-2 bg-red-600/40 py-1.5 px-3 rounded-full">
              <MdWallet className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold text-sm">
                {wallet.balance}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm">
        {user?.isVerified ? (
          <div className="px-3 py-1.5">
            <Marquee
              text={appData.contactDetails?.banner_message?.toString() ?? ''}
            />
          </div>
        ) : (
          <></>
        )}

        {user?.isVerified ? (
          <div className="space-y-2 p-2 bg-gray-50">
            <WalletOptions />
          </div>
        ) : (
          <></>
        )}

        <div className="p-2">
          <ContactRefresh onRefresh={handleRefresh} />
        </div>
      </div>

      <LoadingModal isOpen={isLoading} />
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

const BottomNavBar = () => {
  const router = useRouter();
  const { contactDetails } = useAppData();
  const { user } = useUser();

  const handleWhatsAppClick = () => {
    const phoneNumber = contactDetails?.whatsapp_numebr?.replace(/\D/g, '');
    if (!phoneNumber) {
      alert('Phone number is not available.');
      return;
    }
    window.location.href = `whatsapp://send?phone=${phoneNumber}`;
  };

  const navItems = user?.isVerified
    ? [
        {
          icon: Receipt,
          label: 'My Bids',
          route: 'bids',
        },
        {
          icon: BadgeIndianRupee,
          label: 'Game Rate',
          route: 'game_rate',
        },
        {
          icon: Wallet,
          label: 'Funds',
          route: 'funds',
        },
        {
          icon: MessageCircle,
          label: 'Support',
          action: handleWhatsAppClick,
        },
      ]
    : [];

  const NavButton = ({ icon: Icon, label, onClick, isHome = false }) => {
    if (isHome) {
      return (
        <button
          onClick={onClick}
          className="relative -mt-8 p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-lg transform transition-transform active:scale-95 active:shadow-md"
        >
          <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity" />
        </button>
      );
    }

    return (
      <button
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-1 p-1.5 min-w-[4.5rem] group"
      >
        <Icon
          className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors duration-200"
          strokeWidth={2}
        />
        <span className="text-[0.7rem] font-medium text-gray-600 group-hover:text-red-500 transition-colors duration-200">
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-20">
      <div className="flex justify-around items-center px-3 py-2 max-w-xl mx-auto">
        {navItems.slice(0, 2).map((item, index) => (
          <NavButton
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() =>
              item.route
                ? router.push(`features/${item.route}`)
                : item.action?.()
            }
          />
        ))}

        <NavButton
          icon={HomeIcon}
          onClick={() => router.push('/')}
          isHome={true}
          label={undefined}
        />

        {navItems.slice(2).map((item, index) => (
          <NavButton
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() =>
              item.route
                ? router.push(`features/${item.route}`)
                : item.action?.()
            }
          />
        ))}
      </div>
    </nav>
  );
};

const GameList: React.FC<{ marketData: MarketData[]; isLoading: boolean }> = ({
  marketData,
  isLoading,
}) => {
  const { user } = useUser();

  return (
    <div
      className={`${user?.isVerified ? 'mt-[225px]' : 'mt-[110px]'} mb-20 px-2 py-1 bg-gray-50`}
    >
      <LoadingModal isOpen={isLoading} />
      <div className="space-y-2">
        {marketData.map((market) => (
          <GameCard key={market.id} market={market} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshBalance } = useWallet();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/markets`);
      const data: MarketData[] = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    refreshBalance();
  }, [refreshBalance]);

  return (
    <Suspense>
      <ProtectedRoute>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Navbar refreshMarketData={fetchMarketData} />
        <GameList marketData={marketData} isLoading={isLoading} />
        <BottomNavBar />
      </ProtectedRoute>
    </Suspense>
  );
};

export default Home;
