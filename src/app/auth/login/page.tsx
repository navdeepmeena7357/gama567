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

  // Keeping your existing validation and login logic
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
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50">
      <div className="px-4 py-8 max-w-sm mx-auto">
        <LoadingModal isOpen={isLoading} />
        <Toaster position="top-center" />

        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/png/Logo.png"
            height={120}
            width={120}
            alt="Brand Logo"
            className="object-contain"
          />
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h1 className="text-xl font-semibold text-red-800 text-center mb-6">
            Welcome Back
          </h1>

          {/* Mobile Input */}
          <div className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type="number"
                value={mobileNumber}
                maxLength={10}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-red-50 border border-red-100 
                          text-red-900 placeholder:text-red-300 focus:outline-none focus:border-red-400
                          focus:ring-1 focus:ring-red-400 text-sm"
                placeholder="Mobile Number"
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type="password"
                value={password}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-red-50 border border-red-100 
                          text-red-900 placeholder:text-red-300 focus:outline-none focus:border-red-400
                          focus:ring-1 focus:ring-red-400 text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg
                        flex items-center justify-center gap-2 text-sm font-medium
                        hover:from-red-700 hover:to-red-600 transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Register Button */}
            <button
              onClick={() => router.push('/auth/register')}
              className="w-full bg-brown-100 text-red-800 py-3 rounded-lg
                        flex items-center justify-center gap-2 text-sm font-medium
                        border border-red-200 hover:bg-red-50 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </div>

        {/* Contact Options */}
        <div className="mt-6">
          <p className="text-center text-red-800 text-xs mb-3">
            Need help? Contact us
          </p>
          <ContactOptions />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
