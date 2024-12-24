import React from 'react';
import { PlusCircle, Wallet2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-4 p-2">
      {/* Add Money Button */}
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="relative group flex items-center justify-center gap-3 
          bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600
          hover:from-pink-600 hover:via-purple-600 hover:to-purple-700
          p-2 rounded-xl
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          shadow-lg hover:shadow-xl shadow-pink-500/20
          overflow-hidden"
      >
        {/* Animated Background Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
          blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          animate-pulse"
        />

        {/* Icon Container */}
        <div
          className="relative flex items-center justify-center 
          bg-white/10 backdrop-blur-md p- rounded-xl
          ring-1 ring-white/20 
          group-hover:ring-white/30 group-hover:scale-110 
          transition-all duration-300"
        >
          <PlusCircle className="w-5 h-5 text-white" />
        </div>

        {/* Text Container */}
        <div className="relative flex flex-col items-start">
          <span className="text-sm text-white font-semibold">Add Money</span>
        </div>
      </button>

      {/* Withdraw Button */}
      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="relative group flex items-center justify-center gap-3
          bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800
          hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
          p-2 rounded-xl
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          shadow-sm hover:shadow-sm shadow-white
          overflow-hidden"
      >
        {/* Animated Background Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
          blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          animate-pulse"
        />

        {/* Icon Container */}
        <div
          className="relative flex items-center justify-center 
          bg-white/10 backdrop-blur-md p-1.5 rounded-md
          ring-1 ring-white/20 
          group-hover:ring-white/30 group-hover:scale-110 
          transition-all duration-300"
        >
          <Wallet2 className="w-5 h-5 text-pink-300" />
        </div>

        {/* Text Container */}
        <div className="relative flex flex-col items-start">
          <span className="text-sm text-white font-semibold">Withdraw</span>
        </div>
      </button>
    </div>
  );
};

export default WalletOptions;
