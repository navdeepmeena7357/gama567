'use client';

import RoundedInput from '@/components/RoundedInput';
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

  const validateRequiredFields = (): boolean => {
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
    if (!validateRequiredFields()) {
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
    <>
      <LoadingModal isOpen={isLoading} />

      <TitleBar title="Bank Details" />
      <ToastContainer />
      <SafeArea className={'p-4'}>
        <RoundedInput
          name="ac_holder_name"
          icon={<FaUser />}
          placeholder="A/c Holder Name"
          value={bankDetails.ac_holder_name}
          onChange={handleBankInputChange}
        />

        <RoundedInput
          name="bank_name"
          icon={<RiBankFill />}
          placeholder="Bank Name"
          value={bankDetails.bank_name}
          onChange={handleBankInputChange}
        />

        <RoundedInput
          icon={<FaHashtag />}
          name="ac_number"
          placeholder="Bank Account Number"
          value={bankDetails.ac_number}
          onChange={handleBankInputChange}
          type="number"
        />

        <RoundedInput
          name="ifsc_code"
          icon={<IoInfinite />}
          placeholder="IFSC Code"
          value={bankDetails.ifsc_code}
          onChange={handleBankInputChange}
        />

        <div className="flex mt-2 flex-col items-center">
          <button
            onClick={() => handleSaveBankDetails()}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Save Details
          </button>
        </div>

        <hr className=" h-1 mt-2 bg-black" />

        <RoundedInput
          name="paytm_number"
          icon={<SiPaytm />}
          placeholder="Paytm Number"
          value={paymentApps.paytm_number ?? ''}
          onChange={handlePaymentInputChange}
        />

        <RoundedInput
          name="phonepe_number"
          icon={<SiPhonepe />}
          placeholder="PhonePe Number"
          value={paymentApps.phonepe_number ?? ''}
          onChange={handlePaymentInputChange}
        />

        <RoundedInput
          name="gpay_number"
          icon={<SiGooglepay />}
          placeholder="GPay Number"
          value={paymentApps.gpay_number ?? ''}
          onChange={handlePaymentInputChange}
        />

        <div className="flex mt-2 flex-col items-center">
          <button
            onClick={() => handleSavePaymentApps()}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Save Details
          </button>
        </div>
      </SafeArea>
    </>
  );
};

export default BankDetailsPage;
