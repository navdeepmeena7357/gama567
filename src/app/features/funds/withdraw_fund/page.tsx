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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-brown-50 to-red-100">
      <TitleBar title="Withdraw Fund" />
      <LoadingModal isOpen={loading!} />

      <SafeArea>
        {/* Balance Display */}
        <div className="text-center pt-6 pb-8">
          <p className="text-gray-600 text-xs font-medium mb-1">
            Available Balance
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold text-red-700">
              ₹{points.balance}
            </span>
          </div>
          <div className="mt-2 flex justify-center">
            <ArrowDown className="w-5 h-5 text-red-400 animate-bounce" />
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto space-y-4">
          {/* Input Section */}
          <div className="space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-red-200 shadow-sm">
            <div className="relative group">
              <div
                className="relative bg-white rounded-xl border-2 border-red-200
                transition-all duration-300 group-focus-within:border-red-400
                group-focus-within:shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50/30 via-brown-50/30 to-red-50/30" />
                <div className="relative flex items-center gap-3 p-3">
                  <div className="p-2 bg-gradient-to-br from-red-400 to-brown-400 rounded-lg">
                    <BiRupee className="h-5 w-5 text-white" />
                  </div>
                  <input
                    value={amount}
                    onChange={handleAmount}
                    type="number"
                    placeholder="Enter withdrawal amount"
                    className="flex-1 outline-none text-red-700 placeholder-red-300 text-base
                      bg-transparent w-full font-medium"
                  />
                </div>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-sm font-medium px-2">{error}</p>
            )}
          </div>

          {/* Withdraw Button */}
          {bankDetails ? (
            <button
              disabled={isDisabled || points.balance <= 0}
              onClick={handleWithdraw}
              className="w-full bg-gradient-to-r from-red-500 to-brown-500 text-white
                rounded-xl py-3.5 px-4 font-bold text-sm
                transition-all duration-300
                hover:from-red-600 hover:to-brown-600
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-red-500/10
                relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
              />
              <span className="relative">Withdraw Now</span>
            </button>
          ) : (
            <button
              onClick={() => router.replace('/features/funds/bank_details')}
              className="w-full bg-white/80 backdrop-blur-sm text-red-600
                rounded-xl py-3.5 px-4 font-bold text-sm
                transition-all duration-300 border border-purple-200
                hover:bg-white hover:shadow-md active:scale-[0.98]
                shadow-sm"
            >
              Add Bank Details First
            </button>
          )}

          {/* Contact Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-red-200 shadow-sm space-y-4">
            <p className="text-center text-red-700 font-medium">
              For Fund Queries Contact us
            </p>
            <ContactOptions />
          </div>
        </div>

        {/* Withdrawal Method Modal */}
        {modalVisible && bankDetails && (
          <Modal onClose={() => setModalVisible(false)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-red-200">
              <h2 className="text-lg font-bold text-red-700 text-center mb-4">
                Select Withdrawal Mode
              </h2>

              <div className="space-y-3">
                {withdrawalMethods.map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center p-4 bg-purple-50 rounded-xl 
                      hover:bg-purple-100 transition-all duration-200 cursor-pointer 
                      border border-purple-200"
                  >
                    <input
                      type="radio"
                      name="withdrawalMethod"
                      value={method.value}
                      onChange={() => setSelectedMethod(method.value)}
                      className="mr-3 accent-purple-500"
                    />
                    <span className="text-purple-700 text-sm font-medium">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={sendWithdrawRequest}
                className="w-full mt-6 bg-gradient-to-r from-red-500 to-brown-500 text-white
                  rounded-xl py-3.5 px-4 font-bold text-sm
                  transition-all duration-300
                  hover:from-red-600 hover:to-brown-600
                  active:scale-[0.98] shadow-md"
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
