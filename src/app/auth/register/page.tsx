'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { BASE_URL } from '@/app/services/api';
import { showErrorToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import LoadingModal from '@/components/LoadingModal';
import { UserCircle, Phone, Lock, ArrowRight, LogIn } from 'lucide-react';

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

  // Keeping your existing validation and submission logic
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50">
      <div className="px-6 py-12 max-w-md mx-auto">
        <LoadingModal isOpen={loading} />
        <Toaster position="top-center" />

        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/png/Logo.png"
            height={100}
            width={100}
            alt="Brand Logo"
            className="object-contain"
          />
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-red-800 text-center mb-8">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-red-50 border border-red-100 
                          text-red-900 placeholder:text-red-300 focus:outline-none focus:border-red-400
                          focus:ring-2 focus:ring-red-400/20 text-base"
                placeholder="Your Name"
              />
            </div>

            {/* Mobile Input */}
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
              <input
                type="number"
                value={mobileNumber}
                maxLength={10}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-red-50 border border-red-100 
                          text-red-900 placeholder:text-red-300 focus:outline-none focus:border-red-400
                          focus:ring-2 focus:ring-red-400/20 text-base"
                placeholder="Mobile Number"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-red-50 border border-red-100 
                          text-red-900 placeholder:text-red-300 focus:outline-none focus:border-red-400
                          focus:ring-2 focus:ring-red-400/20 text-base"
                placeholder="Create Password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl
                        flex items-center justify-center gap-3 text-base font-semibold
                        hover:from-red-700 hover:to-red-600 transition-colors
                        shadow-lg shadow-red-500/20"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Login Link */}
            <button
              type="button"
              onClick={() => router.replace('/auth/login')}
              className="w-full bg-red-50 text-red-800 py-4 rounded-xl
                        flex items-center justify-center gap-3 text-base font-semibold
                        border-2 border-red-100 hover:bg-red-100 transition-colors"
            >
              <LogIn className="w-5 h-5" />
              Already Have Account? Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
