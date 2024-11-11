import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { BsCashStack } from 'react-icons/bs';

const WalletOptions = () => {
  const router = useRouter();

  return (
    <div className="flex items-center mt-4 justify-between">
      <button
        onClick={() => router.push('/features/funds/add_fund')}
        className="bg-green-600 flex items-center gap-2 text-center shadow-sm shadow-gray-400  text-sm font-semibold text-white p-2.5 min-w-40 rounded-sm"
      >
        <FaPlus />
        Add Money
      </button>
      <button
        onClick={() => router.push('/features/funds/withdraw_fund')}
        className="bg-green-600 flex items-center text-center gap-2 shadow-sm shadow-gray-400 text-sm font-semibold text-white p-2.5 min-w-40 rounded-sm"
      >
        <BsCashStack />
        Withdrawal
      </button>
    </div>
  );
};

export default WalletOptions;
