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
    <div className="min-h-screen bg-gray-50">
      <LoadingModal isOpen={loading} />
      <TitleBar title="Add Fund" />

      <div className="mt-[20px] px-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* User Card */}
          <UserCard user={user!} balance={points.balance} />

          {/* Divider */}
          <div className="h-1 bg-gray-200 my-4" />

          {/* Contact Section */}
          <div className="flex flex-col items-center">
            <h1 className="font-semibold text-gray-800 mb-2">
              For Fund Queries Contact Us
            </h1>
            <ContactOptions />
          </div>

          {/* Divider */}
          <div className="h-1 bg-gray-200 my-4" />

          {/* Amount Input */}
          <div className="relative">
            <div className="flex items-center border-2 border-gray-300 rounded-full p-2 transition-all duration-200 focus-within:border-red-500">
              <div className="flex-shrink-0">
                <BiRupee className="h-10 w-10 text-white p-2 bg-red-500 rounded-full" />
              </div>
              <input
                type="number"
                placeholder={`Enter Amount (Min: ${paymentDetails?.min_amount ?? '...'}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 ml-2 outline-none bg-transparent placeholder-gray-400 text-gray-800"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-center text-sm">{success}</p>
            </div>
          )}

          {/* Payment Button */}
          <div className="mt-6">
            <button
              onClick={handleAddFund}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium 
                         transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
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
                  <span>Please Wait...</span>
                </div>
              ) : (
                'Pay with UPI'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFundPage;
