'use client';
import SafeArea from '@/components/SafeArea';
import TitleBar from '@/components/TitleBar';
import { FaUser } from 'react-icons/fa6';
import React, { useEffect, useState } from 'react';
import { RiBankFill } from 'react-icons/ri';
import { FaHashtag } from 'react-icons/fa';
import { IoInfinite } from 'react-icons/io5';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SiPaytm } from 'react-icons/si';
import { SiPhonepe } from 'react-icons/si';
import { SiGooglepay } from 'react-icons/si';
import { getTokenFromLocalStorage, getUserIdFromToken } from '@/utils/basic';
import { BASE_URL } from '@/app/services/api';
import LoadingModal from '@/components/LoadingModal';
import {
  BANK_DETAILS_SAVE_ERROR,
  BANK_DETAILS_SAVED_SUCCESS,
  NETWORK_RESPONSE_NOT_OK,
  PAYMENT_APPS_INVALID,
  REQUIRED_FIELDS_ERROR,
} from '@/utils/constants';

type BankDetails = {
  user_id: string;
  ac_holder_name: string;
  bank_name: string;
  ac_number: string;
  ifsc_code: string;
};

type PaymentApps = {
  paytm_number?: string;
  phonepe_number?: string;
  gpay_number?: string;
  user_id: string;
};

export interface BankInfo {
  user_id: string;
  ac_holder_name: string;
  bank_name: string;
  ac_number: string;
  ifsc_code: string;
  paytm_number?: string;
  gpay_number?: string;
  phonepe_number?: string;
  success?: boolean;
  error?: string;
}

const BankDetailsPage = () => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    user_id: '',
    ac_holder_name: '',
    bank_name: '',
    ac_number: '',
    ifsc_code: '',
  });

  const [paymentApps, setPaymentApps] = useState<PaymentApps>({
    paytm_number: '',
    phonepe_number: '',
    gpay_number: '',
    user_id: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const token = getTokenFromLocalStorage();
  const userId = getUserIdFromToken();

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentApps((prevApps) => ({
      ...prevApps,
      [name]: value,
    }));
  };

  const validateRequipinkFields = (): boolean => {
    const { ac_holder_name, bank_name, ac_number, ifsc_code } = bankDetails;
    return (
      ac_holder_name !== '' &&
      bank_name !== '' &&
      ac_number !== '' &&
      validateIfscCode(ifsc_code)
    );
  };

  const validateIfscCode = (ifscCode: string): boolean => {
    return ifscCode.length === 11 && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode);
  };

  const validatePaymentApps = (): boolean => {
    const {
      paytm_number = '',
      phonepe_number = '',
      gpay_number = '',
    } = paymentApps;

    const isValidPaytm = /^\d{10}$/.test(paytm_number);
    const isValidPhonePe = /^\d{10}$/.test(phonepe_number);
    const isValidGPay = /^\d{10}$/.test(gpay_number);

    return isValidPaytm || isValidPhonePe || isValidGPay;
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        setIsLoading(true);
        if (!token) {
          throw new Error('Authorization token is missing.');
        }

        const response = await fetch(`${BASE_URL}/get_bank_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bank details');
        }

        const data: BankInfo = await response.json();
        if (data.success) {
          setPaymentApps(data);
          setBankDetails(data);
        } else {
          toast.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
        toast.error('Failed to fetch bank details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, [token, userId]);

  const handleSaveBankDetails = async () => {
    if (!validateRequipinkFields()) {
      toast.error(REQUIRED_FIELDS_ERROR);
      return;
    }

    try {
      setIsLoading(true);
      const bankDetailsWithUserId = {
        ...bankDetails,
        user_id: userId,
      };

      const response = await fetch(`${BASE_URL}/add_bank_info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bankDetailsWithUserId),
      });

      if (!response.ok) {
        throw new Error(NETWORK_RESPONSE_NOT_OK);
      }
      toast.success(BANK_DETAILS_SAVED_SUCCESS);
    } catch (error) {
      console.log(error);
      toast.error(BANK_DETAILS_SAVE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePaymentApps = async () => {
    if (!validatePaymentApps()) {
      toast.error(PAYMENT_APPS_INVALID);
      return;
    }

    try {
      setIsLoading(true);
      const paymentNumbersData = {
        ...paymentApps,
        user_id: userId,
      };
      const response = await fetch(`${BASE_URL}/add_upi_number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentNumbersData),
      });

      if (!response.ok) {
        throw new Error(NETWORK_RESPONSE_NOT_OK);
      }
      toast.success(BANK_DETAILS_SAVED_SUCCESS);
    } catch (error) {
      console.log(error);
      toast.error(BANK_DETAILS_SAVE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-600 to-pink-800">
      <LoadingModal isOpen={isLoading} />
      <TitleBar title="Bank Details" />
      <ToastContainer />

      <SafeArea>
        <div className="p-3 space-y-6">
          {/* Bank Details Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h2 className="text-white font-bold  text-lg mb-4">
              Bank Account Details
            </h2>

            <div className="space-y-3">
              {/* Account Holder Name */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <FaUser className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="ac_holder_name"
                    value={bankDetails.ac_holder_name}
                    onChange={handleBankInputChange}
                    placeholder="A/c Holder Name"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <RiBankFill className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="bank_name"
                    value={bankDetails.bank_name}
                    onChange={handleBankInputChange}
                    placeholder="Bank Name"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>

              {/* Account Number */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <FaHashtag className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    type="number"
                    name="ac_number"
                    value={bankDetails.ac_number}
                    onChange={handleBankInputChange}
                    placeholder="Bank Account Number"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>

              {/* IFSC Code */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <IoInfinite className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="ifsc_code"
                    value={bankDetails.ifsc_code}
                    onChange={handleBankInputChange}
                    placeholder="IFSC Code"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Bank Details Button */}
            <button
              onClick={handleSaveBankDetails}
              className="w-full mt-4 bg-white text-pink-600 
              rounded-lg py-3 px-4 font-bold text-sm 
              transition-all duration-300
              hover:bg-pink-50 active:scale-[0.98]
              shadow-lg shadow-black/20
              relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-100 to-transparent
              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
              />
              <span className="relative">Save Bank Details</span>
            </button>
          </div>

          {/* Payment Apps Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <h2 className="text-white font-bold  text-lg mb-4">Payment Apps</h2>

            <div className="space-y-3">
              {/* Paytm */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <SiPaytm className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="paytm_number"
                    value={paymentApps.paytm_number ?? ''}
                    onChange={handlePaymentInputChange}
                    placeholder="Paytm Number"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>

              {/* PhonePe */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <SiPhonepe className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="phonepe_number"
                    value={paymentApps.phonepe_number ?? ''}
                    onChange={handlePaymentInputChange}
                    placeholder="PhonePe Number"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>

              {/* GPay */}
              <div className="relative group">
                <div
                  className="relative bg-black/20 rounded-lg border-2 border-white/20
                transition-all duration-300 group-focus-within:border-white/40"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <SiGooglepay className="w-4 h-4 text-pink-300 group-focus-within:text-white transition-colors" />
                  </div>
                  <input
                    name="gpay_number"
                    value={paymentApps.gpay_number ?? ''}
                    onChange={handlePaymentInputChange}
                    placeholder="GPay Number"
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-white placeholder-pink-200
                    text-sm  font-medium outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Payment Apps Button */}
            <button
              onClick={handleSavePaymentApps}
              className="w-full mt-4 bg-white text-pink-600 
              rounded-lg py-3 px-4 font-bold text-sm
              transition-all duration-300
              hover:bg-pink-50 active:scale-[0.98]
              shadow-lg shadow-black/20
              relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-100 to-transparent
              translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
              />
              <span className="relative">Save Payment Details</span>
            </button>
          </div>
        </div>
      </SafeArea>
    </div>
  );
};

export default BankDetailsPage;
