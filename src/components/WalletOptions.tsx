import React from 'react';
import { PlusCircle, Wallet2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Add Money Button */}
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700 
          py-2.5 px-2 rounded-xl
          transform transition-all duration-200 
          active:scale-[0.98] shadow-md shadow-blue-500/10"
      >
        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <div
            className="bg-white/20 p-1.5 rounded-lg 
            group-hover:scale-110 transition-transform duration-200"
          >
            <PlusCircle className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-white font-medium">Add Money</span>
        </div>
      </button>

      {/* Withdrawal Button */}
      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500
          hover:from-yellow-500 hover:to-yellow-600
          py-2.5 px-2 rounded-xl
          transform transition-all duration-200
          active:scale-[0.98] shadow-md shadow-yellow-500/10"
      >
        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <div
            className="bg-white/20 p-1.5 rounded-lg
            group-hover:scale-110 transition-transform duration-200"
          >
            <Wallet2 className="w-4 h-4 text-slate-900" />
          </div>
          <span className="text-sm text-slate-900 font-medium">Withdraw</span>
        </div>
      </button>
    </div>
  );
};

export default WalletOptions;
