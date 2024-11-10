'use client';

import InfoCard from '@/components/InfoCard';
import TitleBar from '@/components/TitleBar';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BiMoneyWithdraw } from 'react-icons/bi';
import { LuIndianRupee } from 'react-icons/lu';
import { MdHistoryToggleOff } from 'react-icons/md';
import { RiBankFill, RiHistoryFill } from 'react-icons/ri';

const FundsPage = () => {
  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(`funds/${route}`);
  };
  return (
    <>
      <TitleBar title="Manage Funds" />
      <div className="mt-[60px] m-2 flex flex-col gap-2">
        <InfoCard
          title="Add Fund"
          marqueeText="Add money to your wallet"
          Icon={LuIndianRupee}
          onClick={() => handleNavigation('add_fund')}
        />

        <InfoCard
          title="Withdraw Fund"
          marqueeText="Withdraw money to bank"
          Icon={BiMoneyWithdraw}
          onClick={() => handleNavigation('withdraw_fund')}
        />

        <InfoCard
          title="Bank Detail"
          marqueeText="Add your bank details"
          Icon={RiBankFill}
          onClick={() => handleNavigation('bank_details')}
        />

        <InfoCard
          title="Add Fund History"
          marqueeText="Add money to your wallet"
          Icon={MdHistoryToggleOff}
          onClick={() => handleNavigation('add_fund_history')}
        />
        <InfoCard
          title="Withdraw Fund History"
          marqueeText="Add money to your wallet"
          Icon={RiHistoryFill}
          onClick={() => handleNavigation('withdraw_fund_history')}
        />
      </div>
    </>
  );
};

export default FundsPage;
