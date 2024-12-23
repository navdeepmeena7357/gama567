'use client';
import ContactOptions from '@/components/ContactOptions';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import { useUser } from '@/context/UserContext';
import { useWallet } from '@/context/WalletContext';
import { useEffect, useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { BiRupee } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { usePayment } from '@/context/PaymentContext';
import LoadingModal from '@/components/LoadingModal';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';
import { BASE_URL } from '@/app/services/api';
import { IoCloseCircle } from 'react-icons/io5';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { ArrowDown } from 'lucide-react';

interface BankDetails {
  ac_holder_name: string;
  bank_name: string;
  ac_number: string;
  ifsc_code: string;
  paytm_number: string | null;
  gpay_number: string | null;
  phonepe_number: string | null;
  success: boolean;
  error: string;
}
interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const AddFundPage = () => {
  const router = useRouter();
  const user = useUser();
  const points = useWallet();
  const appData = useAppData();
  const [amount, setAmount] = useState('');
  const { paymentDetails } = usePayment();
  const [modalVisible, setModalVisible] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>();
  const [isDisabled, setIsDisabled] = useState<boolean>();
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleWithdraw = () => {
    if (bankDetails) {
      if (validateAmount()) {
        setModalVisible(true);
      }
    } else {
    }
  };
  const fetchBankDetails = async () => {
    const token = getTokenFromLocalStorage();
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/get_bank_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token!,
        },
        body: JSON.stringify({ user_id: getUserIdFromToken() }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setBankDetails(data);
      } else {
        setBankDetails(null);
        setError(data.error);
      }
    } catch (err) {
      console.log(err);
      setError('Bank Details not found !');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails();
    setIsDisabled(user.user?.isWithdrawAllowed === 0);
  }, [user.user]);

  const minWithdrawAmount = paymentDetails?.min_withdrawal;
  const maxWithdrawAmount = paymentDetails?.max_withdrawal;
  const withdrawOpenTime = appData.contactDetails?.withdraw_open_time;
  const withdrawCloseTime = appData.contactDetails?.withdraw_close_time;

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.value) {
      setAmount(e.target.value);
    }
  };

  const isCurrentTimeWithinWithdrawTime = (
    withdrawOpen: string,
    withdrawClose: string
  ): boolean => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const currentTimeString = new Intl.DateTimeFormat('en-GB', options).format(
      new Date()
    );

    return (
      currentTimeString >= withdrawOpen && currentTimeString < withdrawClose
    );
  };

  const isValidWithdrawal = (withdrawalAmount: number) => {
    if (minWithdrawAmount === undefined || maxWithdrawAmount === undefined) {
      throw new Error(
        'Minimum and maximum withdrawal amounts are not defined.'
      );
    }
    return (
      withdrawalAmount >= minWithdrawAmount &&
      withdrawalAmount <= maxWithdrawAmount
    );
  };

  const validateAmount = () => {
    const withdrawAmount = Number(amount);

    if (withdrawAmount) {
      if (
        !isCurrentTimeWithinWithdrawTime(
          withdrawOpenTime || '10:00',
          withdrawCloseTime || '10:00'
        )
      ) {
        setError(
          `Withdrawals time between ${withdrawOpenTime} AM and ${withdrawCloseTime} AM.`
        );
        return;
      }
      if (isNaN(withdrawAmount)) {
        setError('Enter valid amount');
        return;
      }

      if (withdrawAmount <= 0) {
        setError('Enter valid amount');
        return;
      }

      if (withdrawAmount > points.balance) {
        setError('Insufficient wallet balance.');
        return;
      }

      if (!isValidWithdrawal(withdrawAmount)) {
        setError('Minimum withdraw amount 1000');
        return;
      }

      return true;
    } else {
      setError('Enter valid amount');
    }
  };

  const sendWithdrawRequest = async () => {
    if (!selectedMethod) {
      showErrorToast('Please select a withdrawal method.');
      return;
    }

    setLoading(true);
    const response = await fetch(`${BASE_URL}/withdraw_funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
      body: JSON.stringify({
        number: selectedMethod,
        user_id: getUserIdFromToken(),
        amount: amount,
      }),
    });

    const data = await response.json();

    if (data.status) {
      showSuccessToast('Request Sent ! Wait for 10-30 minutes');
      points.refreshBalance();
      router.replace('/features/funds/withdraw_fund_history');
      setAmount('');
      setModalVisible(false);
    } else {
      showErrorToast(data.message);
      setModalVisible(false);
    }
    setLoading(false);
  };

  const Modal: React.FC<ModalProps> = ({ onClose, children }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-md">
        <span onClick={onClose} style={{ cursor: 'pointer' }}>
          <IoCloseCircle className="text-2xl" />
        </span>
        {children}
      </div>
    </div>
  );

  const withdrawalMethods = [
    {
      label: `${bankDetails?.bank_name} (${bankDetails?.ac_number})`,
      value: 'bank',
      available: !!bankDetails?.ac_number,
    },
    {
      label: `Paytm: ${bankDetails?.paytm_number}`,
      value: 'paytm',
      available: !!bankDetails?.paytm_number,
    },
    {
      label: `PhonePe: ${bankDetails?.phonepe_number}`,
      value: 'phonepe',
      available: !!bankDetails?.phonepe_number,
    },
    {
      label: `GPay: ${bankDetails?.gpay_number}`,
      value: 'gpay',
      available: !!bankDetails?.gpay_number,
    },
  ].filter((method) => method.available);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800">
      <TitleBar title="Withdraw Fund" />
      <LoadingModal isOpen={loading!} />

      <SafeArea>
        {/* Balance Display */}
        <div className="text-center pt-4 pb-6">
          <p className="text-white/70 text-xs italic mb-1">Available Balance</p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold text-white italic">
              ₹{points.balance}
            </span>
          </div>
          <div className="mt-2 flex justify-center">
            <ArrowDown className="w-5 h-5 text-white/60 animate-bounce" />
          </div>
        </div>

        <div className="px-3 space-y-4">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="relative group">
              <div
                className="relative bg-black/20 rounded-lg border-2 border-white/20
              transition-all duration-300 group-focus-within:border-white/40
              overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="relative flex items-center gap-2 p-2">
                  <div className="p-1.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                    <BiRupee className="h-5 w-5 text-white" />
                  </div>
                  <input
                    value={amount}
                    onChange={handleAmount}
                    type="number"
                    placeholder="Enter withdrawal amount"
                    className="flex-1 outline-none text-white placeholder-red-200 text-base italic
                    bg-transparent w-full"
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="text-red-200 text-xs italic mt-2 px-2">{error}</p>
            )}
          </div>

          {/* Withdraw Button */}
          {bankDetails ? (
            <button
              disabled={isDisabled || points.balance <= 0}
              onClick={handleWithdraw}
              className="w-full bg-white text-red-600 
              rounded-lg py-3 px-4 font-bold text-sm italic
              transition-all duration-300
              hover:bg-red-50 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-black/20
              relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100 to-transparent
              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
              />
              <span className="relative">Withdraw Now</span>
            </button>
          ) : (
            <button
              onClick={() => router.replace('/features/funds/bank_details')}
              className="w-full bg-white/10 backdrop-blur-sm text-white
              rounded-lg py-3 px-4 font-bold text-sm italic
              transition-all duration-300 border-2 border-white/20
              hover:bg-white/20 active:scale-[0.98]
              shadow-lg shadow-black/20"
            >
              Add Bank Details First
            </button>
          )}

          {/* Contact Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 space-y-3">
            <p className="text-center text-white italic text-sm font-bold">
              For Fund Querys Contact us
            </p>
            <ContactOptions />
          </div>
        </div>

        {/* Withdrawal Method Modal */}
        {modalVisible && bankDetails && (
          <Modal onClose={() => setModalVisible(false)}>
            <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-xl shadow-lg p-6 max-w-md mx-auto border-2 border-white/20">
              <h2 className="text-lg font-bold text-white italic text-center mb-4">
                Select Withdrawal Mode
              </h2>

              <div className="space-y-2">
                {withdrawalMethods.map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center p-3 bg-white/10 rounded-lg hover:bg-white/20
                    transition-all duration-200 cursor-pointer border border-white/20"
                  >
                    <input
                      type="radio"
                      name="withdrawalMethod"
                      value={method.value}
                      onChange={() => setSelectedMethod(method.value)}
                      className="mr-3"
                    />
                    <span className="text-white italic text-sm">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={sendWithdrawRequest}
                className="w-full mt-4 bg-white text-red-600 
                rounded-lg py-3 px-4 font-bold text-sm italic
                transition-all duration-300
                hover:bg-red-50 active:scale-[0.98]
                shadow-lg shadow-black/20"
              >
                Confirm Withdrawal
              </button>
            </div>
          </Modal>
        )}
      </SafeArea>
    </div>
  );
};

export default AddFundPage;
