import React from 'react';
import { PlusCircle, Wallet2, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="flex justify-center gap-2 items-center p-2 bg-red-500 rounded-lg active:scale-95 transition-all"
      >
        <div className="relative bg-white/20 p-1.5 rounded mb-2">
          <PlusCircle className="w-4 h-4 text-white" />
          <ArrowUpRight className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-sm font-medium text-white">Add Money</span>
      </button>

      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="flex justify-center gap-2 items-center p-2 bg-red-500 rounded-lg active:scale-95 transition-all"
      >
        <div className="relative bg-red-500 p-1.5 rounded mb-2">
          <Wallet2 className="w-4 h-4 text-white" />
          <ArrowUpRight className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-sm font-medium text-white">Withdraw</span>
      </button>
    </div>
  );
};

export default WalletOptions;
