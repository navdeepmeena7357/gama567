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
import { Wallet, CreditCard, History, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen mt-14 bg-gradient-to-br from-red-50 to-pink-50">
      <LoadingModal isOpen={loading} />
      <TitleBar title="Add Fund" />

      {/* Wallet Card */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Wallet className="w-6 h-6" />
            <CreditCard className="w-6 h-6" />
          </div>
          <p className="text-xs opacity-80 mb-1">Available Balance</p>
          <div className="flex items-center gap-1 mb-3">
            <BiRupee className="w-6 h-6" />
            <span className="text-2xl font-bold">{points.balance}</span>
          </div>
          <div className="flex items-center gap-2 text-xs opacity-80">
            <History className="w-4 h-4" />
            <span>Last updated just now</span>
          </div>
        </div>
      </div>

      {/* Quick Amount Selection */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-red-100">
          <div className="grid grid-cols-2 gap-2">
            {[500, 1000, 2000, 5000].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className="bg-red-50 py-3 rounded-lg text-red-800 text-sm font-medium
                         hover:bg-red-100 active:scale-[0.98] transition-all duration-200"
              >
                ₹{amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="px-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-sm font-medium text-red-800 mb-3">Enter Amount</p>
          <div className="relative bg-red-50 rounded-lg p-3 mb-4">
            <div className="absolute top-1/2 -translate-y-1/2 left-3">
              <BiRupee className="w-5 h-5 text-red-400" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 bg-transparent outline-none text-red-900 placeholder-red-300"
              placeholder={`Minimum ${paymentDetails?.min_amount ?? '100'}`}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <p className="text-red-600 text-xs text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <p className="text-green-600 text-xs text-center">{success}</p>
            </div>
          )}

          <button
            onClick={handleAddFund}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white 
                     rounded-lg py-3 flex items-center justify-center gap-2
                     hover:from-red-700 hover:to-red-600 transition-all duration-200
                     disabled:opacity-50 shadow-sm"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-sm font-medium">Proceed to Add</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-6 px-4">
        <p className="text-center text-xs text-red-600 mb-2">
          Need assistance with payment?
        </p>
        <ContactOptions />
      </div>
    </div>
  );
};

export default AddFundPage;
