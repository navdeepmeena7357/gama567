'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import {
  Receipt,
  HomeIcon,
  Wallet,
  MessageCircle,
  BadgeIndianRupee,
  Menu,
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
    <nav className="fixed top-0 left-0 right-0 z-30">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 shadow-lg shadow-blue-500/20">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>

            <div className="flex items-baseline">
              <h1 className="text-xl font-bold text-white tracking-tight">
                KALYAN
              </h1>
              <span className="ml-1 text-xl font-black text-yellow-300 tracking-tight">
                BAZAR
              </span>
            </div>
          </div>

          {/* Wallet Section */}
          {user?.isVerified ? (
            <div className="relative group">
              <div
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 
                py-2 px-4 rounded-xl transition-all duration-200"
              >
                <Wallet className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-sm font-medium">
                  ₹{wallet.balance}
                </span>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-white border-b border-slate-200">
        {user?.isVerified ? (
          <>
            {/* Marquee Section */}
            <div className="px-4 py-2 border-b border-slate-100">
              <Marquee
                text={appData.contactDetails?.banner_message?.toString() ?? ''}
              />
            </div>

            {/* Wallet Options */}
            <div className="pl-3 pr-3 bg-slate-50/50">
              <WalletOptions />
            </div>
          </>
        ) : (
          <div></div>
        )}

        {/* Contact Refresh Section */}
        <div className="pl-3 pr-3 pt-2 pb-">
          <ContactRefresh onRefresh={handleRefresh} />
        </div>
      </div>

      {/* Modals & Drawers */}
      <LoadingModal isOpen={isLoading} />
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </nav>
  );
};

interface NavItem {
  icon: React.ElementType;
  label: string;
  route?: string;
  action?: () => void;
}

interface NavButtonProps {
  icon: React.ElementType;
  label?: string;
  onClick: () => void;
  isHome?: boolean;
}

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

  const navItems: NavItem[] = user?.isVerified
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

  const NavButton: React.FC<NavButtonProps> = ({
    icon: Icon,
    label,
    onClick,
    isHome = false,
  }) => {
    if (isHome) {
      return (
        <button
          onClick={onClick}
          className="relative -mt-8 p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 
            shadow-lg transform transition-transform active:scale-95 active:shadow-md"
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
