import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { BsCashStack } from 'react-icons/bs';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
        flex items-center justify-center gap-2 text-white font-medium py-3 px-2 
        rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
      >
        <div className="bg-red-400/30 p-1.5 rounded-full">
          <FaPlus className="w-3 h-3" />
        </div>
        <span>Add Money</span>
      </button>

      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
        flex items-center justify-center gap-2 text-white font-medium py-3 px-2 
        rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
      >
        <div className="bg-red-400/30 p-1.5 rounded-full">
          <BsCashStack className="w-3 h-3" />
        </div>
        <span>Withdrawal</span>
      </button>
    </div>
  );
};

export default WalletOptions;
