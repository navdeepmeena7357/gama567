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
import { User, UserCircle, Phone, Lock, ArrowRight, LogIn } from 'lucide-react';

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
      setUser({
        id: user.id,
        name: user.name,
        username: user.username,
        isVerified: user.is_verified,
        isDepositAllowed: user.is_deposit_allowed,
        isWithdrawAllowed: user.is_withdraw_allowed,
        status: user.status,
      });

      authenticate(responseData.token);
      router.push('/');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 sm:p-6">
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoadingModal isOpen={loading} variant="pulse" />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-1 h-14 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          <span className="text-red-500">Create</span> Your Account
        </h1>
      </div>

      {/* Image */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48">
          <Image
            src="/images/png/Logo.png"
            alt="Sign Up"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto w-full"
      >
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <UserCircle className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
              focus:border-red-500 focus:ring-1 focus:ring-red-500
              placeholder:text-gray-400 text-gray-900"
            placeholder="Enter your name"
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="tel"
            value={mobileNumber}
            maxLength={10}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
              focus:border-red-500 focus:ring-1 focus:ring-red-500
              placeholder:text-gray-400 text-gray-900"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
              focus:border-red-500 focus:ring-1 focus:ring-red-500
              placeholder:text-gray-400 text-gray-900"
            placeholder="Create password"
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 
            hover:from-red-600 hover:to-red-700
            text-white font-medium py-3.5 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] shadow-sm
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white 
            font-medium py-3.5 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          Already Have Account? Login
        </button>
      </form>

      {/* Support Section */}
      <div className="mt-8 space-y-4">
        <p className="text-center text-gray-600 font-medium">
          Need help signing up?
        </p>
        <ContactOptions />
      </div>
    </div>
  );
}

export default RegisterPage;
