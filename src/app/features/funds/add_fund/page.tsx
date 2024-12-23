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
    <div className="min-h-screen mt-14 bg-gradient-to-b from-red-600 to-red-800">
      <LoadingModal isOpen={loading} />
      <TitleBar title="Add Fund" />

      {/* Balance Display */}
      <div className="text-center pt-4 pb-8">
        <p className="text-white/70 text-xs italic mb-1">Current Balance</p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold text-white italic">
            ₹{points.balance}
          </span>
        </div>
        <div className="mt-2 flex justify-center">
          <ArrowDown className="w-5 h-5 text-white/60 animate-bounce" />
        </div>
      </div>

      <div className="px-3 m-2">
        {/* Quick Amount Selection */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[300, 500, 1000, 2000].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(String(quickAmount))}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm
                border border-white/20 rounded-lg py-2 px-1
                text-white text-xs font-bold italic
                transition-all duration-200 active:scale-[0.98]
                relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
              />
              <span className="relative">₹{quickAmount}</span>
            </button>
          ))}
        </div>

        {/* Amount Input Section */}
        <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
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
                  type="number"
                  placeholder={`Enter amount (min: ${paymentDetails?.min_amount ?? '100'})`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 outline-none text-white placeholder-red-200 text-base italic
                    bg-transparent w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg animate-fade-in backdrop-blur-sm">
            <p className="text-white text-xs italic text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg animate-fade-in backdrop-blur-sm">
            <p className="text-white text-xs italic text-center">{success}</p>
          </div>
        )}

        {/* Payment Button */}
        <button
          onClick={handleAddFund}
          disabled={loading}
          className="w-full bg-white text-red-600 
            rounded-lg py-3 px-4 font-bold text-sm italic
            transition-all duration-300 mt-6
            hover:bg-red-50
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-lg shadow-black/20
            relative overflow-hidden group"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100 to-transparent
            translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
          />
          <span className="relative">
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-4 h-4 border-2 border-red-600/20 border-t-red-600 
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
        <div className="mt-6 text-center space-y-3 pb-6">
          <p className="text-white/80 text-xs italic">
            Need help with payment?
          </p>
          <ContactOptions />
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;
