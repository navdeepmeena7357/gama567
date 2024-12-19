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
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 sm:p-6">
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoadingModal isOpen={loading} variant="pulse" />

      {/* Image */}
      <div className="flex justify-center mb-5">
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
        className="space-y-5 max-w-md mx-auto w-full"
      >
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <UserCircle className="w-5 h-5 text-blue-500 group-focus-within:text-yellow-500 transition-colors" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 
              focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
              placeholder:text-slate-400 text-slate-900 bg-white
              transition-all duration-200"
            placeholder="Enter your name"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-blue-500 group-focus-within:text-yellow-500 transition-colors" />
          </div>
          <input
            type="tel"
            value={mobileNumber}
            maxLength={10}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 
              focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
              placeholder:text-slate-400 text-slate-900 bg-white
              transition-all duration-200"
            placeholder="Enter mobile number"
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-blue-500 group-focus-within:text-yellow-500 transition-colors" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 
              focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
              placeholder:text-slate-400 text-slate-900 bg-white
              transition-all duration-200"
            placeholder="Create password"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 
            hover:from-blue-600 hover:to-blue-700
            text-white font-medium py-4 rounded-2xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] disabled:opacity-70
            shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500
            hover:from-yellow-500 hover:to-yellow-600
            text-slate-900 font-medium py-4 rounded-2xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] shadow-lg shadow-yellow-500/20"
        >
          <LogIn className="w-4 h-4" />
          Already Have Account? Login
        </button>
      </form>

      {/* Support Section */}
      <div className="mt-3 space-y-4">
        <p className="text-center text-slate-600 font-medium">
          Need help signing up?
        </p>
        <ContactOptions />
      </div>
    </div>
  );
}

export default RegisterPage;
