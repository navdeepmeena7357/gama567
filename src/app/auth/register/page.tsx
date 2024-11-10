'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import ContactOptions from '@/components/ContactOptions';
import { BASE_URL } from '@/app/services/api';
import { showErrorToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import LoadingModal from '@/components/LoadingModal';
import { FaLock, FaPhone } from 'react-icons/fa';
import { MdAccountCircle } from 'react-icons/md';

export interface User {
  id: number;
  name: string;
  username: string;
  is_verified: number;
  is_deposit_allowed: number;
  is_withdraw_allowed: number;
  mobile: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface RegisterResponse {
  error: string | null;
  isError: boolean;
  passcode?: number;
  token: string;
  userId?: number;
  message: string;
  user?: User;
}

function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { authenticate } = useAuth();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!name || name.length < 4 || name.length > 50) {
      return 'Enter valid name';
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileNumber || !mobileRegex.test(mobileNumber)) {
      return 'Mobile number must be exactly 10 digits.';
    }

    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return null;
  };

  const goHome = () => {
    router.push('/');
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          username: mobileNumber,
          password,
          passcode: '0000',
        }),
      });

      const responseData: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed');
      }

      if (responseData.isError) {
        showErrorToast(responseData.message);
        return;
      }

      const user = responseData.user!;

      const userData = {
        id: user.id,
        name: user.name,
        username: user.username,
        isVerified: user.is_verified,
        isDepositAllowed: user.is_deposit_allowed,
        isWithdrawAllowed: user.is_withdraw_allowed,
        status: user.status,
      };

      setUser(userData);
      authenticate(responseData.token);
      goHome();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = () => {
    router.replace('/auth/login');
  };

  return (
    <div className="font-custom px-5 py-2">
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoadingModal isOpen={loading} />

      <div className="flex item-center">
        <div className="bg-orange-600 w-2 h-14"></div>
        <h1 className="uppercase text-lg font-bold ml-2 text-orange-600">
          Create a new <br />
          account
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <Image
          className="justify-center"
          src="/images/svg/sign-up.svg"
          width={200}
          height={200}
          alt="Login Image"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2 mt-6"></div>

        <div className="mb-4 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-orange-500 rounded-full p-2">
            <MdAccountCircle className="text-white" />
          </div>
          <input
            type="text"
            id="name"
            className="border-2 border-gray-300 text-black  rounded-full focus:outline-none focus:ring-0 focus:border-orange-500 block w-full pl-12 p-3.5"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 mt-2 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-orange-500 rounded-full p-2">
            <FaPhone className="text-white" />
          </div>
          <input
            type="tel"
            value={mobileNumber}
            maxLength={10}
            className="border-2 border-gray-300 text-black  rounded-full focus:outline-none focus:ring-0 focus:border-orange-500 block w-full pl-12 p-3.5"
            placeholder="Enter Mobile Number"
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-orange-500 rounded-full p-2">
            <FaLock className="text-white" />
          </div>
          <input
            type="password"
            value={password}
            className="border-2 border-gray-300 text-black  rounded-full focus:outline-none focus:ring-0 focus:border-orange-500 block w-full pl-12 p-3.5"
            placeholder="•••••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="mr-12 ml-12">
          <button
            type="submit"
            className={`text-white font-semibold bg-orange-600 hover:bg-orange-500 items-center focus:ring-0 focus:outline-none rounded-full text-sm w-full px-5 py-3 uppercase text-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="w-full flex justify-center items-center text-center mt-2">
        <ContactOptions />
      </div>

      <button onClick={handleNavigate} className="w-full ">
        <div className="w-full flex justify-center items-center text-center mt-2">
          <div className="bg-green-500 w-64 p-2 rounded-full text-center items-center text-white mt-2">
            Already Registered? Login
          </div>
        </div>
      </button>
    </div>
  );
}

export default RegisterPage;
