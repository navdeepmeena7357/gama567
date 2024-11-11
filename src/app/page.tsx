'use client';
import ProtectedRoute from '@/components/ProctectedRoute';
import LoadingModal from '@/components/LoadingModal';
import React, { useState, useEffect, Suspense } from 'react';
import { BASE_URL } from './services/api';
import { Toaster } from 'react-hot-toast';
import GameCard from '@/components/GameCard';
import Drawer from '@/components/Drawer';
import { HiOutlineMenuAlt1 } from 'react-icons/hi';
import WalletOptions from '@/components/WalletOptions';
import ContactOptions from '@/components/ContactOptions';
import Marquee from '@/components/Marquee';
import { useWallet } from '@/context/WalletContext';
import { useAppData } from '@/context/AppDataContext';
import { FaReceipt } from 'react-icons/fa';
import { FaRupeeSign } from 'react-icons/fa';
import { RiBankFill } from 'react-icons/ri';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { IoMdHome } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { MdWallet } from 'react-icons/md';
import { useUser } from '@/context/UserContext';

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

const Navbar = () => {
  const appData = useAppData();
  const [isOpen, setIsOpen] = useState(false);
  const wallet = useWallet();
  const { user } = useUser();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="text-white bg-white items-center fixed top-0 left-0 right-0 z-10 p-3">
      <div className="flex justify-between items-center">
        <div className="flex">
          <HiOutlineMenuAlt1
            onClick={toggleDrawer}
            className="h-9 w-9 text-green-500 shadow-sm shadow-zinc-300 rounded"
          />

          <div className="text-gray-700 font-bold text-[26px] ml-2">
            KALYAN <span className="text-green-600">99</span>
          </div>

          <Drawer isOpen={isOpen} onClose={toggleDrawer} />
        </div>

        {user?.isVerified ? (
          <div className="text-gray-800 flex items-center space-x-1">
            <MdWallet className="w-7 h-7" />
            <h1>{wallet.balance}</h1>
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="text-black mt-2">
        {user?.isVerified ? (
          <Marquee
            text={appData.contactDetails?.banner_message.toString() ?? ' '}
          />
        ) : (
          <div></div>
        )}

        {user?.isVerified ? (
          <div>
            <WalletOptions />
          </div>
        ) : (
          <div></div>
        )}
        <ContactOptions />
      </div>
    </nav>
  );
};

const BottomNavBar = () => {
  const router = useRouter();
  const { contactDetails } = useAppData();
  const { user } = useUser();
  const handleWhatsAppClick = () => {
    const rawPhoneNumber = contactDetails?.whatsapp_numebr;
    const phoneNumber = rawPhoneNumber ? rawPhoneNumber.replace(/\D/g, '') : '';
    if (!phoneNumber) {
      alert('Phone number is not available.');
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    window.location.href = whatsappUrl;
  };

  const handleNavigation = (route: string) => {
    router.push(`features/${route}`);
  };

  return (
    <nav className="bg-white border-t-2 items-center fixed bottom-0 left-0 right-0 p-2">
      <div className="flex bg-white  justify-between items-center">
        {user?.isVerified ? (
          <div
            onClick={() => handleNavigation('bids')}
            className="flex gap-2 flex-col items-center justify-items-center"
          >
            <FaReceipt className="h-5 w-5" />
            <h1 className="text-sm font-medium">My Bids</h1>
          </div>
        ) : (
          <div></div>
        )}

        {user?.isVerified ? (
          <div
            onClick={() => handleNavigation('game_rate')}
            className="flex gap-2 flex-col items-center justify-items-center"
          >
            <FaRupeeSign className="h-5 w-5" />
            <h1 className="text-sm font-medium">Game Rate</h1>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex gap-2 rounded-full bg-green-500 flex-col items-center justify-items-center">
          <IoMdHome className="h-6 w-6 m-3 text-white" />
        </div>

        {user?.isVerified ? (
          <div
            onClick={() => handleNavigation('funds')}
            className="flex gap-2 flex-col items-center justify-items-center"
          >
            <RiBankFill className="h-5 w-5" />
            <h1 className="text-sm font-medium">Funds</h1>
          </div>
        ) : (
          <div></div>
        )}

        {user?.isVerified ? (
          <div
            onClick={handleWhatsAppClick}
            className="flex gap-2 flex-col items-center justify-items-center"
          >
            <IoChatbubbleEllipsesOutline className="h-5 w-5" />
            <h1 className="text-sm font-medium">Support</h1>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
};

const GameList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const fetchMarketData = async () => {
      const response = await fetch(`${BASE_URL}/markets`);
      const data: MarketData[] = await response.json();
      setMarketData(data);
      setIsLoading(false);
    };

    fetchMarketData();
  }, []);

  return (
    <div
      className={`${
        !user?.isVerified ? 'mt-24' : 'mt-48'
      } mb-16 overflow-y-auto h-screen bg-white`}
    >
      <LoadingModal isOpen={isLoading} />
      {marketData.map((market) => (
        <GameCard key={market.id} market={market} />
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const { refreshBalance } = useWallet();
  useEffect(() => {
    refreshBalance();
  });

  return (
    <Suspense>
      <ProtectedRoute>
        <Toaster position="bottom-center" reverseOrder={false} />
        <Navbar />
        <GameList />
        <BottomNavBar />
      </ProtectedRoute>
    </Suspense>
  );
};

export default Home;
