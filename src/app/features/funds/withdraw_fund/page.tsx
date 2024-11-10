'use client';
import Card from '@/components/Card';
import ContactOptions from '@/components/ContactOptions';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import UserCard from '@/components/UserWalletCard';
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
import { Toaster } from 'react-hot-toast';

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
  const { paymentDetails, isLoading } = usePayment();
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
    <>
      <TitleBar title="Withdraw Fund" />
      <LoadingModal isOpen={isLoading || loading!} />
      <Toaster position="bottom-center" reverseOrder={false} />
      <SafeArea>
        <Card>
          <UserCard user={user.user!} balance={points.balance} />
          <hr className=" h-1 mt-2 bg-black" />
          <div className="flex flex-col items-center mt-2">
            <h1 className="font-semibold">For Fund Query&apos;s Contact us</h1>
            <ContactOptions />
          </div>
          <hr className=" h-1 mt-2 bg-black" />
          <div className="flex mt-2 items-center border-2 border-gray-300 rounded-full p-2 focus-within:border-orange-500">
            <BiRupee className="h-10 w-10 text-white p-1 mr-2 bg-orange-500 rounded-full" />
            <input
              value={amount}
              onChange={handleAmount}
              type="number"
              placeholder="Enter Amount"
              className="flex-1 outline-none bg-transparent placeholder-gray-400"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1 ml-2">{error}</p>}

          <div className="flex flex-col items-center mt-4">
            <button
              hidden={!bankDetails}
              disabled={isDisabled || points.balance <= 0}
              onClick={() => handleWithdraw()}
              className="bg-orange-500 text-white font-medium py-2 px-4 rounded shadow-md hover:bg-orange-600 disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
            >
              Withdraw Cash
            </button>
          </div>
          {modalVisible && bankDetails && (
            <Modal onClose={() => setModalVisible(false)}>
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <h2 className="text-xl font-semibold text-center text-orange-600 p-2">
                  Select Withdrawal Mode
                </h2>

                <ul className="mt-4 space-y-2">
                  {withdrawalMethods.map((method) => (
                    <li key={method.value}>
                      <label className="flex items-center p-2 bg-orange-100 rounded-md hover:bg-orange-200 transition">
                        <input
                          type="radio"
                          name="withdrawalMethod"
                          value={method.value}
                          onChange={() => setSelectedMethod(method.value)}
                          className="mr-2"
                        />
                        <span>{method.label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="modal-actions mt-4">
                  <button
                    onClick={() => sendWithdrawRequest()}
                    className="w-full bg-orange-500 text-white font-medium py-2 rounded hover:bg-orange-600 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </div>
            </Modal>
          )}

          <div className="flex justify-center items-center text-center mt-4">
            {!bankDetails && (
              <button
                onClick={() => {
                  router.replace('/features/funds/bank_details');
                }}
                className="border border-orange-600 text-orange-600 p-2 rounded-md hover:bg-orange-50 transition duration-300"
              >
                Add Bank Details
              </button>
            )}
          </div>
        </Card>
      </SafeArea>
    </>
  );
};

export default AddFundPage;
