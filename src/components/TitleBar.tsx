import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';
import { FaWallet } from 'react-icons/fa';
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
      {/* Gradient Background */}
      <div
        className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 
        shadow-lg shadow-purple-500/10"
      >
        <div className="flex items-center justify-between p-3 mx-auto">
          {/* Left Section: Back Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack || defaultBack}
              className="p-2 rounded-xl hover:bg-white/10 active:bg-white/20
                transition-colors duration-200 active:scale-95"
            >
              <IoIosArrowBack className="w-5 h-5 text-white" />
            </button>

            <h1 className="text-base font-semibold text-white tracking-wide">
              {title}
            </h1>
          </div>

          {/* Right Section: Wallet Balance */}
          {user?.isVerified ? (
            <div
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm
              py-1.5 px-4 rounded-xl border border-white/20
              hover:bg-white/20 transition-colors duration-200"
            >
              <FaWallet className="w-4 h-4 text-pink-300" />
              <span className="text-sm font-medium text-white">
                ₹{wallet.balance ?? '...'}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Bottom Border Gradient */}
      <div
        className="h-[1px] w-full bg-gradient-to-r from-purple-400/0 
        via-pink-400/50 to-purple-400/0"
      />
    </nav>
  );
};

export default TitleBar;
