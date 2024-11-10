import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdCurrencyRupee } from 'react-icons/md';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options)
    .format(date)
    .replace(',', ' - ');
};

interface DepositHistoryCardProps {
  date: string;
  transactionId: string;
  amount: number;
  txnType: string;
  depositMode: string;
}

const DepositHistoryCard: React.FC<DepositHistoryCardProps> = ({
  date,
  transactionId,
  amount,
  txnType,
  depositMode,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center p-1">
        <h1 className="text-gray-600 text-sm">{formatDate(date)}</h1>
        <h1 className="text-gray-500 text-sm">Transaction ID</h1>
      </div>

      <div className="p-1 flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <FaCircleCheck className="text-green-500" />
          <h1 className="flex items-center font-semibold text-orange-600">
            <MdCurrencyRupee />
            {amount}
          </h1>
        </div>
        <h1 className="text-sm font-serif">{transactionId}</h1>
      </div>

      <hr className="h-0.5 mt-2 bg-gray-400" />
      <div className="flex justify-between items-center p-1">
        <h1 className="text-gray-600 text-sm">Txn Type</h1>
        <h1 className="text-gray-500 text-sm">Deposit Mode</h1>
      </div>
      <div className="flex justify-between items-center p-1">
        <h1 className="text-green-500 text-sm font-semibold">{txnType}</h1>
        <h1 className="text-gray-700 text-sm font-semibold">{depositMode}</h1>
      </div>
    </div>
  );
};

export default DepositHistoryCard;
