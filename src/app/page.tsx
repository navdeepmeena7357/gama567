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
  LucideIcon,
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
import Image from 'next/image';

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
      <div
        className="bg-gradient-to-r from-purple-700 to-purple-800 px-4 py-2.5 
        shadow-lg shadow-purple-900/30 border-b border-pink-300/10"
      >
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 hover:bg-pink-400/10 rounded-lg transition-all duration-300
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-400/20"
            >
              <Menu className="h-5 w-5 text-pink-300" />
            </button>

            <div className="items-center">
              <Image
                src={'/images/png/name.png'}
                alt="Matkafun"
                height={120}
                width={120}
              />
            </div>
          </div>

          {/* Wallet Section */}
          {user?.isVerified ? (
            <div className="relative group">
              <div
                className="flex items-center gap-2 bg-pink-400/10 hover:bg-pink-400/15 
                py-1.5 px-3 rounded-lg transition-all duration-300
                border border-pink-300/20"
              >
                <Wallet className="w-3.5 h-3.5 text-pink-300" />
                <span className="text-white text-xs font-bold">
                  ₹{wallet.balance}
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Sub Header */}
      <div
        className="bg-gradient-to-b from-purple-800/90 to-purple-900/90 backdrop-blur-md 
        border-b border-pink-300/10"
      >
        {user?.isVerified ? (
          <>
            {/* Marquee Section */}
            <div className="px-4 py-2 border-b border-pink-300/10">
              <Marquee
                text={appData.contactDetails?.banner_message?.toString() ?? ''}
              />
            </div>

            {/* Wallet Options */}
            <div className="px-2 bg-black/5">
              <WalletOptions />
            </div>
          </>
        ) : (
          <></>
        )}

        {/* Contact Refresh Section */}
        <div className="px-2">
          <ContactRefresh onRefresh={handleRefresh} />
        </div>
      </div>

      {/* Modals & Drawers */}
      <LoadingModal isOpen={isLoading} />
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Toaster position="bottom-center" reverseOrder={false} />
    </nav>
  );
};

interface NavItem {
  icon: LucideIcon;
  label: string;
  route?: string;
  action?: () => void;
}

interface NavButtonProps {
  icon: LucideIcon;
  label?: string;
  onClick: () => void;
  isHome?: boolean;
  isActive?: boolean;
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
    isActive = false,
  }) => {
    if (isHome) {
      return (
        <button
          onClick={onClick}
          className="relative p-3 rounded-2xl 
            bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500
            shadow-lg transform transition-all duration-300
            hover:shadow-xl hover:-translate-y-1
            active:scale-95 active:shadow-md"
        >
          <div className="relative z-10">
            <Icon
              className="h-6 w-6 text-white drop-shadow-md"
              strokeWidth={2.5}
            />
          </div>
          <div
            className="absolute inset-0 rounded-2xl bg-black/10 opacity-0 
            hover:opacity-100 transition-opacity"
          />
        </button>
      );
    }

    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1.5 
          py-2 px-3 rounded-xl transition-all duration-300 group
          ${
            isActive
              ? 'bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10'
              : 'hover:bg-gray-100'
          }`}
      >
        <Icon
          className={`h-5 w-5 transition-all duration-300
            ${
              isActive
                ? 'text-purple-600 scale-110'
                : 'text-gray-500 group-hover:text-gray-700'
            }`}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span
          className={`text-xs font-medium transition-all duration-300
          ${
            isActive
              ? 'text-purple-600'
              : 'text-gray-500 group-hover:text-gray-700'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <nav
      className="fixed bottom-4 left-4 right-4 
      bg-white/90 backdrop-blur-lg border border-gray-200
      rounded-2xl shadow-xl shadow-gray-200/50 z-20"
    >
      <div className="flex justify-around items-center px-2 py-1 mx-auto">
        {navItems.slice(0, 2).map((item, index) => (
          <NavButton
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() =>
              item.route
                ? router.push(`/features/${item.route}`)
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
                ? router.push(`/features/${item.route}`)
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
      className={`${user?.isVerified ? 'mt-[230px]' : 'mt-[110px]'} mb-20 px-2 py-1 bg-gray-50`}
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
  const { user } = useUser();
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
        {user?.isVerified ? <BottomNavBar /> : <></>}
      </ProtectedRoute>
    </Suspense>
  );
};

export default Home;
