'use client';
import ContactOptions from '@/components/ContactOptions';
import TitleBar from '@/components/TitleBar';
import { useUser } from '@/context/UserContext';
import { useWallet } from '@/context/WalletContext';
import { useState } from 'react';
import { BiRupee } from 'react-icons/bi';
import { usePayment } from '@/context/PaymentContext';
import { generateTxnId } from '@/utils/basic';
import LoadingModal from '@/components/LoadingModal';
import { createDepositRequest } from '@/app/services/api';
import { ArrowDown } from 'lucide-react';

const AddFundPage = () => {
  const { user } = useUser();
  const { paymentDetails } = usePayment();
  const points = useWallet();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddFund = async () => {
    if (!amount || parseFloat(amount) < (paymentDetails?.min_amount || 0)) {
      setError(
        `Please enter amount of at least ${paymentDetails?.min_amount}.`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const txnId = generateTxnId();

      const depositResponse = await createDepositRequest({
        user_id: user?.id || 0,
        username: user?.name || '',
        amount: parseFloat(amount),
      });

      if (depositResponse.success) {
        const upiLink = generateUPILink({
          payeeVPA: paymentDetails!.upi_id,
          payeeName: 'Laxmi 567',
          transactionNote: `Add Fund - ${txnId}`,
          amount: amount,
          transactionId: txnId,
        });

        window.location.href = upiLink;

        setSuccess('Deposit request created. Please complete the payment.');
        setAmount('');
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to process request'
      );
    } finally {
      setLoading(false);
    }
  };

  const generateUPILink = ({
    payeeVPA,
    payeeName,
    transactionNote,
    amount,
    transactionId,
  }: {
    payeeVPA: string;
    payeeName: string;
    transactionNote: string;
    amount: string;
    transactionId: string;
  }) => {
    const upiURL = new URL('upi://pay');
    upiURL.searchParams.append('pa', payeeVPA);
    upiURL.searchParams.append('pn', payeeName);
    upiURL.searchParams.append('tn', transactionNote);
    upiURL.searchParams.append('am', amount);
    upiURL.searchParams.append('tr', transactionId);
    upiURL.searchParams.append('cu', 'INR');

    return upiURL.toString();
  };

  return (
    <div className="min-h-screen mt-14 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <LoadingModal isOpen={loading} />
      <TitleBar title="Add Fund" />

      {/* Balance Display */}
      <div className="text-center pt-6 pb-8">
        <p className="text-gray-600 text-xs font-medium mb-1">
          Current Balance
        </p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold text-purple-700">
            ₹{points.balance}
          </span>
        </div>
        <div className="mt-2 flex justify-center">
          <ArrowDown className="w-5 h-5 text-purple-400 animate-bounce" />
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        {/* Quick Amount Selection */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[300, 500, 1000, 2000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(String(quickAmount))}
              className="relative overflow-hidden group
                bg-white/80 hover:bg-white backdrop-blur-sm
                border border-purple-200 rounded-xl py-2.5 px-1
                text-purple-700 text-sm font-medium
                transition-all duration-300 active:scale-[0.98]
                shadow-sm hover:shadow-md"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-purple-50/50
                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
              />
              <span className="relative">₹{quickAmount}</span>
            </button>
          ))}
        </div>

        {/* Amount Input Section */}
        <div className="space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-sm">
          <div className="relative group">
            <div
              className="relative bg-white rounded-xl border-2 border-purple-200
              transition-all duration-300 group-focus-within:border-purple-400
              group-focus-within:shadow-md overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/30 via-pink-50/30 to-purple-50/30" />
              <div className="relative flex items-center gap-3 p-3">
                <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg">
                  <BiRupee className="h-5 w-5 text-white" />
                </div>
                <input
                  type="number"
                  placeholder={`Enter amount (min: ${paymentDetails?.min_amount ?? '100'})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 outline-none text-purple-700 placeholder-purple-300 text-base
                    bg-transparent w-full font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 p-4 bg-red-50/80 border border-red-200 rounded-xl animate-fade-in backdrop-blur-sm">
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl animate-fade-in backdrop-blur-sm">
            <p className="text-emerald-600 text-sm text-center font-medium">
              {success}
            </p>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handleAddFund}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white
            rounded-xl py-3.5 px-4 font-bold text-sm
            transition-all duration-300 mt-6
            hover:from-purple-600 hover:to-pink-600
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-purple-500/10
            relative overflow-hidden group"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
            translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
          />
          <span className="relative">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-white/20 border-t-white
                  rounded-full animate-spin"
                />
                <span>Processing...</span>
              </div>
            ) : (
              'Add Money Now'
            )}
          </span>
        </button>

        {/* Contact Section */}
        <div className="mt-8 text-center space-y-3 pb-8">
          <p className="text-purple-600/80 text-sm font-medium">
            Need help with payment?
          </p>
          <ContactOptions />
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;
