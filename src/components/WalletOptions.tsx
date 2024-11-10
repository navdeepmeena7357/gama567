import { useRouter } from 'next/navigation';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="flex items-center mt-4 justify-between">
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="bg-orange-600 shadow-sm shadow-gray-400  text-sm font-semibold text-white p-2.5 min-w-40 rounded-sm"
      >
        Add Money
      </button>
      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="bg-orange-600 shadow-sm shadow-gray-400 text-sm font-semibold text-white p-2.5 min-w-40 rounded-sm"
      >
        Withdrawal
      </button>
    </div>
  );
};

export default WalletOptions;
