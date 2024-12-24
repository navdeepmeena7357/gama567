'use client';
import React, { useState, useEffect } from 'react';
import ContactOptions from '@/components/ContactOptions';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/auth';
import { useAuth } from '@/context/AuthContext';

import { useUser } from '@/context/UserContext';
import { Phone, Lock, ArrowRight, UserPlus } from 'lucide-react';
import Image from 'next/image';
import LoadingModal from '@/components/LoadingModal';
import { Toaster } from 'react-hot-toast';
import { showErrorToast } from '@/utils/toast';

function LoginPage() {
  const { setUser } = useUser();
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticate } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const validateInputs = (): boolean => {
    if (!mobileNumber) {
      showErrorToast('Mobile number is required');

      return false;
    }
    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      showErrorToast('Mobile number must be 10 digits.');
      return false;
    }
    if (!password) {
      showErrorToast('Password is required..');

      return false;
    }
    if (password.length < 6) {
      showErrorToast('Password must be at least 6 characters long.');

      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const { token, user, isError, message } = await login(
        mobileNumber,
        password
      );

      if (isError) {
        showErrorToast(message);
        return;
      }

      if (user.status === 1) {
        showErrorToast('Account Blocked. Please contact Admin!');

        return;
      }

      setUser({
        id: user.id,
        name: user.name,
        username: user.username,
        isVerified: user.is_verified,
        isDepositAllowed: user.is_deposit_allowed,
        isWithdrawAllowed: user.is_withdraw_allowed,
        status: user.status,
      });

      authenticate(token);
      router.push('/');
    } catch (err) {
      showErrorToast((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-900 flex flex-col p-4 sm:p-6">
      {/* Loading and Toast Components */}
      <Toaster />
      <LoadingModal isOpen={isLoading} />

      {/* Logo */}
      <div className="flex justify-center mb-12">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <Image
            src={'/images/png/Logo.png'}
            height={120}
            width={120}
            alt="Brand Logo"
            className="object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Form Container */}
      <div className="space-y-5 max-w-md mx-auto w-full bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-pink-300/20 shadow-xl">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-pink-500/90 mb-8">
          Welcome Back
        </h1>

        {/* Mobile Input */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-pink-400 group-focus-within:text-pink-300 transition-colors" />
          </div>
          <input
            type="number"
            value={mobileNumber}
            maxLength={10}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-pink-400/90
              focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20
              placeholder:text-white/80 text-white bg-white/5
              transition-all duration-300 font-medium text-md"
            placeholder="Mobile Number"
            onChange={(e) => setMobileNumber(e.target.value)}
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
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-pink-400/90
              focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20
            placeholder:text-white/80 text-white bg-white/5
              transition-all duration-300 font-medium text-dm"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-4 rounded-xl
            hover:from-pink-600 hover:to-pink-700
            flex items-center justify-center gap-2
            transform transition-all duration-300
            active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
            shadow-lg shadow-pink-500/20 text-md"
        >
          Sign In
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Register Button */}
        <button
          onClick={() => router.push('/auth/register')}
          className="w-full bg-purple-800 hover:bg-purple-900
            text-white/80 font-bold py-4 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-300
            active:scale-95 shadow-lg shadow-purple-900/30 text-md"
        >
          <UserPlus className="w-5 h-5" />
          Create Account
        </button>
      </div>

      {/* Support Section */}
      <div className="flex justify-center gap-4 mt-8">
        <ContactOptions />
      </div>
    </div>
  );
}

export default LoginPage;
