import React from 'react';
import { PlusCircle, Wallet2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-2 ml-2 mr-2">
      {/* Add Money Button */}
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600
          hover:from-red-600 hover:to-red-700 
          py-2 px-2 rounded-lg
          transform transition-all duration-200 
          active:scale-[0.98] shadow-lg shadow-red-500/20
          border border-white/10"
      >
        {/* Shine Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
        />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <div
            className="bg-white/20 p-1.5 rounded-md backdrop-blur-sm
            group-hover:scale-110 transition-transform duration-200"
          >
            <PlusCircle className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs text-white font-bold italic">Add Money</span>
        </div>
      </button>

      {/* Withdrawal Button */}
      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="group relative overflow-hidden bg-yellow-500
          hover:bg-white/20
          py-2 px-2 rounded-lg
          transform transition-all duration-200
          active:scale-[0.98] shadow-lg
          backdrop-blur-sm border border-white/20"
      >
        {/* Shine Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
        />

        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <div
            className="bg-white/20 p-1.5 rounded-md
            group-hover:scale-110 transition-transform duration-200"
          >
            <Wallet2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs text-white font-bold italic">Withdraw</span>
        </div>
      </button>
    </div>
  );
};

export default WalletOptions;
