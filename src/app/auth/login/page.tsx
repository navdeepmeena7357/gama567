'use client';
import React, { useState, useEffect } from 'react';
import ContactOptions from '@/components/ContactOptions';
import { useRouter } from 'next/navigation';
import { login } from '@/app/services/auth';
import { showErrorToast } from '@/utils/toast';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import LoadingModal from '@/components/LoadingModal';
import { useUser } from '@/context/UserContext';
import { Phone, Lock, ArrowRight, UserPlus } from 'lucide-react';
import Image from 'next/image';

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
      showErrorToast('Mobile number is required.');
      return false;
    }
    if (mobileNumber.length !== 10 || !/^\d{10}$/.test(mobileNumber)) {
      showErrorToast('Mobile number must be 10 digits.');
      return false;
    }
    if (!password) {
      showErrorToast('Password is required.');
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
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 sm:p-6">
      {/* Loading and Toast Components */}
      <LoadingModal isOpen={isLoading} variant="pulse" />
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Image */}
      <div className="flex justify-center mb-12">
        <div className="relative w-48 h-48">
          <Image
            src="/images/png/Logo.png"
            alt="Login"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 max-w-md mx-auto w-full">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-blue-500 group-focus-within:text-yellow-500 transition-colors" />
          </div>
          <input
            type="number"
            value={mobileNumber}
            maxLength={10}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200
              focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
              placeholder:text-slate-400 text-slate-900 bg-white
              transition-all duration-200"
            placeholder="Enter Mobile Number"
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-blue-500 group-focus-within:text-yellow-500 transition-colors" />
          </div>
          <input
            type="password"
            value={password}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200
              focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20
              placeholder:text-slate-400 text-slate-900 bg-white
              transition-all duration-200"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600
            hover:from-blue-600 hover:to-blue-700
            text-white font-medium py-4 rounded-2xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
            shadow-lg shadow-blue-500/20"
        >
          Login to Account
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push('/auth/register')}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500
            hover:from-yellow-500 hover:to-yellow-600
            text-slate-900 font-medium py-4 rounded-2xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] shadow-lg shadow-yellow-500/20"
        >
          <UserPlus className="w-4 h-4" />
          Create New Account
        </button>
      </div>

      {/* Support Section */}
      <div className="mt-4 space-y-4">
        <p className="text-center text-slate-600 font-medium">
          Need help or forgot password?
        </p>
        <ContactOptions />
      </div>
    </div>
  );
}

export default LoginPage;
