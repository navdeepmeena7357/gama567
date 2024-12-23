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
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-800 flex flex-col p-4 sm:p-6">
      {/* Loading and Toast Components */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoadingModal isOpen={loading} />
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48">
          <Image
            src="/images/png/Logo.png"
            alt="DPBoss Matka"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-md mx-auto w-full bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-red-300/20"
      >
        <h1 className="text-xl font-bold text-center text-white italic mb-8 drop-shadow-lg">
          Create New Account
        </h1>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <UserCircle className="w-5 h-5 text-white group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white
              focus:border-white focus:ring-2 focus:ring-white/20
              placeholder:text-white text-white bg-transparent
              transition-all duration-200 italic font-medium"
            placeholder="Enter your name"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-white group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="tel"
            value={mobileNumber}
            maxLength={10}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white
              focus:border-white focus:ring-2 focus:ring-white/20
              placeholder:text-white text-white bg-transparent
              transition-all duration-200 italic font-medium"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-white group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white
              focus:border-white focus:ring-2 focus:ring-white/20
              placeholder:text-white text-white bg-transparent
              transition-all duration-200 italic font-medium"
            placeholder="Create password"
          />
        </div>

        {error && (
          <div
            className="bg-white/10 backdrop-blur-sm border border-red-400 
            text-white p-4 rounded-xl text-sm italic"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-red-600 font-bold py-4 rounded-xl
            hover:bg-red-100 
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
            shadow-lg shadow-black/20 italic"
        >
          {loading ? (
            <div
              className="w-5 h-5 border-2 border-red-600/20 border-t-red-600 
              rounded-full animate-spin"
            />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.replace('/auth/login')}
          className="w-full bg-red-700 hover:bg-red-800 
            text-white font-bold py-4 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-95 shadow-lg shadow-black/20 italic"
        >
          <LogIn className="w-4 h-4" />
          Already Have Account? Login
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
