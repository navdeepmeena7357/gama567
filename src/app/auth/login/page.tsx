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
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 sm:p-6">
      <LoadingModal isOpen={isLoading} variant="pulse" />
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-1 h-14 bg-gradient-to-b from-red-500 to-red-600 rounded-full" />
        <h1 className="text-xl font-bold text-gray-900 uppercase">
          <span className="text-red-500">Login</span> to Your Account
        </h1>
      </div>

      {/* Image */}
      <div className="flex justify-center mb-8">
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
      <div className="space-y-4 max-w-md mx-auto w-full">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="number"
            value={mobileNumber}
            maxLength={10}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
              focus:border-red-500 focus:ring-1 focus:ring-red-500
              placeholder:text-gray-400 text-gray-900"
            placeholder="Enter Mobile Number"
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-red-500" />
          </div>
          <input
            type="password"
            value={password}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 
              focus:border-red-500 focus:ring-1 focus:ring-red-500
              placeholder:text-gray-400 text-gray-900"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 
            hover:from-red-600 hover:to-red-700
            text-white font-medium py-3.5 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] shadow-sm"
        >
          Login to Account
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push('/auth/register')}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white 
            font-medium py-3.5 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-[0.98] shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Create New Account
        </button>
      </div>

      {/* Support Section */}
      <div className="mt-8 space-y-4">
        <p className="text-center text-gray-600 font-medium">
          Need help or forgot password?
        </p>
        <ContactOptions />
      </div>
    </div>
  );
}

export default LoginPage;
