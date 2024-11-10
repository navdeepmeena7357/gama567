'use client';
import TitleBar from '@/components/TitleBar';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  return (
    <Suspense>
      <section>
        <div>
          <TitleBar title={name ?? ''} />
        </div>
        {children}
      </section>
    </Suspense>
  );
}
