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
    <nav className="bg-white w-full z-10 p-1.5 fixed left-0 top-0 font-semibold justify-between shadow-sm flex items-center pl-2">
      <div className="flex items-center">
        <IoIosArrowBack
          className="w-8 h-8 text-green-500"
          onClick={onBack || defaultBack}
        />
        <h1 className="text-lg uppercase p-2">{title}</h1>
      </div>

      {user?.isVerified ? (
        <div className="flex items-center mr-2 gap-1">
          <FaWallet />
          <h1>{wallet.balance ?? '...'}</h1>
        </div>
      ) : (
        <div></div>
      )}
    </nav>
  );
};

export default TitleBar;
