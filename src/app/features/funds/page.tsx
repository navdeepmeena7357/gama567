'use client';

import InfoCard from '@/components/InfoCard';
import TitleBar from '@/components/TitleBar';
import { IndianRupeeIcon, Banknote, BanknoteIcon, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const FundsPage = () => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(`funds/${route}`);
  };

  return (
    <>
      <TitleBar title="Manage Funds" />
      <div className="mt-[70px] m-2 flex flex-col gap-2">
        <InfoCard
          title="Add Fund"
          marqueeText="Add money to your wallet"
          Icon={IndianRupeeIcon}
          onClick={() => handleNavigation('add_fund')}
        />

        <InfoCard
          title="Withdraw Fund"
          marqueeText="Withdraw money to bank"
          Icon={Banknote}
          onClick={() => handleNavigation('withdraw_fund')}
        />

        <InfoCard
          title="Bank Detail"
          marqueeText="Add your bank details"
          Icon={BanknoteIcon}
          onClick={() => handleNavigation('bank_details')}
        />

        <InfoCard
          title="Add Fund History"
          marqueeText="Add money to your wallet"
          Icon={History}
          onClick={() => handleNavigation('add_fund_history')}
        />

        <InfoCard
          title="Withdraw Fund History"
          marqueeText="Add money to your wallet"
          Icon={History}
          onClick={() => handleNavigation('withdraw_fund_history')}
        />
      </div>
    </>
  );
};

export default FundsPage;
