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
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-700 flex flex-col p-4 sm:p-6">
      {/* Loading and Toast Components */}
      <Toaster position="bottom-center" reverseOrder={false} />
      <LoadingModal isOpen={isLoading} />
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48">
          <Image
            src="/images/png/Logo.png"
            alt="Laxmi 777 Matka"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 max-w-md mx-auto w-full bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-red-300/20">
        <h1 className="text-3xl font-bold text-center text-white italic mb-8 drop-shadow-lg">
          Login
        </h1>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Phone className="w-5 h-5 text-red-400 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="number"
            value={mobileNumber}
            maxLength={10}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white
              focus:border-white focus:ring-2 focus:ring-white
              placeholder:text-white text-white bg-transparent
              transition-all duration-200 italic font-medium"
            placeholder="Enter Mobile Number"
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Lock className="w-5 h-5 text-red-400 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="password"
            value={password}
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-white
              focus:border-white focus:ring-2 focus:ring-white/20
              placeholder:text-white text-white bg-transparent
              transition-all duration-200 italic font-medium"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-white text-red-600 font-bold py-4 rounded-xl
            hover:bg-red-100 
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
            shadow-lg shadow-black/20 italic"
        >
          Login Now
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.push('/auth/register')}
          className="w-full bg-red-700 hover:bg-red-800 
            text-white font-bold py-4 rounded-xl
            flex items-center justify-center gap-2
            transform transition-all duration-200
            active:scale-95 shadow-lg shadow-black/20 italic"
        >
          <UserPlus className="w-4 h-4" />
          New Account
        </button>
      </div>

      {/* Support Section */}

      <div className="flex justify-center gap-4 mt-2">
        <ContactOptions />
      </div>
    </div>
  );
}

export default LoginPage;
