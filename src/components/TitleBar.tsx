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
    <nav className="bg-red-500 w-full z-20 fixed left-0 top-0 shadow-md">
      <div className="flex items-center justify-between p-3 mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack || defaultBack}
            className="p-1 rounded-full hover:bg-red-400 transition-colors"
          >
            <IoIosArrowBack className="w-6 h-6 text-white" />
          </button>

          <h1 className="text-lg font-bold text-white uppercase tracking-wide">
            {title}
          </h1>
        </div>

        {user?.isVerified ? (
          <div className="flex items-center gap-2 bg-red-600 py-1.5 px-3 rounded-full">
            <FaWallet className="text-white" />
            <span className="text-white font-medium">
              {wallet.balance ?? '...'}
            </span>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
};

export default TitleBar;
