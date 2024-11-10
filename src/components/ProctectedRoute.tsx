'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const isBrowser = typeof window !== 'undefined';

  if (isBrowser) {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
