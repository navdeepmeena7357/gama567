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
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 flex flex-col p-4 sm:p-6">
      {/* Loading and Toast Components */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoadingModal isOpen={loading} />

      {/* Logo */}
      <div className="flex justify-center mb-12">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <Image
            src="/images/png/Logo.png"
            alt="Brand Logo"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto w-full bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-pink-300/20 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-pink-500 mb-8">
          Create Account
        </h1>

        {/* Name Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <UserCircle className="w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/80
              focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20
              placeholder:text-white/90 text-white bg-white/5
              transition-all duration-300 font-medium text-md"
            placeholder="Your Name"
          />
        </div>

        {/* Mobile Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors" />
          </div>
          <input
            type="tel"
            value={mobileNumber}
            maxLength={10}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/90
              focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20
              placeholder:text-white/90 text-white bg-white/5
              transition-all duration-300 font-medium text-md"
            placeholder="Mobile Number"
          />
        </div>

        {/* Password Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/90
              focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20
              placeholder:text-white/90 text-white bg-white/5
              transition-all duration-300 font-medium text-md"
            placeholder="Create Password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-pink-500/10 backdrop-blur-sm border border-pink-500/30 
            text-pink-200 p-4 rounded-xl text-sm font-medium"
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium py-3 rounded-xl
            hover:from-pink-600 hover:to-pink-700
            flex items-center justify-center gap-2
            transform transition-all duration-300
            active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
            shadow-lg shadow-pink-500/20 text-md"
        >
          {loading ? (
            <div
              className="w-5 h-5 border-2 border-white/20 border-t-white 
              rounded-full animate-spin"
            />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Login Link Button */}
        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="w-full bg-purple-800 hover:bg-purple-900
            text-white/90 font-medium py-3 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-300
            active:scale-95 shadow-sm shadow-white/30 text-md"
        >
          <LogIn className="w-5 h-5" />
          Already Have Account? Sign In
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
