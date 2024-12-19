'use client';
import ContactOptions from '@/components/ContactOptions';
import TitleBar from '@/components/TitleBar';
import UserCard from '@/components/UserWalletCard';
import { useUser } from '@/context/UserContext';
import { useWallet } from '@/context/WalletContext';
import { useState } from 'react';
import { BiRupee } from 'react-icons/bi';
import { usePayment } from '@/context/PaymentContext';
import { generateTxnId } from '@/utils/basic';
import LoadingModal from '@/components/LoadingModal';
import { createDepositRequest } from '@/app/services/api';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LoadingModal isOpen={loading} />
      <TitleBar title="Add Fund" />

      <div className="mt-6 px-4 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* User Card Section */}
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800">
            <UserCard user={user!} balance={points.balance} />
          </div>

          {/* Main Content Section */}
          <div className="p-6 space-y-6">
            {/* Amount Input Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Enter Amount
              </h2>
              <div className="relative group">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl 
                  transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-red-500/25"
                />
                <div
                  className="relative bg-white rounded-xl p-2 border-2 border-transparent
                  transition-all duration-300 group-focus-within:border-red-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                      <BiRupee className="h-6 w-6 text-white" />
                    </div>
                    <input
                      type="number"
                      placeholder={`Min amount: ${paymentDetails?.min_amount ?? '...'}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl animate-fade-in">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-fade-in">
                <p className="text-emerald-600 text-sm text-center">
                  {success}
                </p>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handleAddFund}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white 
                rounded-xl py-4 px-6 font-semibold text-lg
                transition-all duration-300 
                hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                'Pay Now with UPI'
              )}
            </button>

            {/* Contact Section */}
            <div className="pt-4 border-t border-gray-100">
              <div className="text-center space-y-4">
                <ContactOptions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;
