import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { Coins } from 'lucide-react';
import { useUser } from '@/context/UserContext';

interface TitleBarProps {
  title: string;
  onBack?: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, onBack }) => {
  const wallet = useWallet();
  const router = useRouter();
  const { user } = useUser();

  const defaultBack = () => {
    router.back();
  };

  return (
    <nav className="fixed left-0 top-0 w-full z-20">
      {/* Main Header */}
      <div className="bg-white border-b border-red-100">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between h-14">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack || defaultBack}
                className="w-8 h-8 flex items-center justify-center 
                         rounded-lg hover:bg-red-50 active:bg-red-100
                         transition-colors"
              >
                <IoIosArrowBack className="w-5 h-5 text-red-800" />
              </button>

              <h1 className="text-base font-semibold text-red-900">{title}</h1>
            </div>

            {/* Right: Balance */}
            {user?.isVerified ? (
              <div className="relative group">
                <div
                  className="flex items-center gap-2 bg-gradient-to-r 
                             from-red-500 to-red-600 text-white
                             py-1.5 px-3 rounded-lg"
                >
                  <Coins className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    ₹{wallet.balance ?? '...'}
                  </span>
                </div>

                {/* Hover Effect */}
                <div
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 
                             bg-pink-500 scale-x-0 group-hover:scale-x-100 
                             transition-transform origin-left"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar - Optional Animation */}
      <div className="h-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500" />
    </nav>
  );
};

export default TitleBar;
