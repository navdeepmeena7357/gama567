import React from 'react';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdCurrencyRupee } from 'react-icons/md';
import { IoIosCloseCircle } from 'react-icons/io';
import { GoClockFill } from 'react-icons/go';

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

interface WithdrawHistoryCardProps {
  date: string;
  status: string;
  amount: number;
  txnType: string;
  withdrawMode: string;
}

const WithdrawHistoryCard: React.FC<WithdrawHistoryCardProps> = ({
  date,
  status,
  amount,
  txnType,
  withdrawMode,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center p-1">
        <h1 className="text-gray-600 text-sm">{formatDate(date)}</h1>
      </div>

      <div className="p-1 flex justify-between items-center">
        <div className="flex gap-1 items-center">
          {status === 'Approved' ? (
            <FaCircleCheck className="text-green-500" />
          ) : status === 'Rejected' ? (
            <IoIosCloseCircle className="text-red-500" />
          ) : (
            <GoClockFill className="text-yellow-500" />
          )}
          <h1 className="flex items-center font-semibold ">
            <MdCurrencyRupee />
            {amount}
          </h1>
        </div>
        <h1
          className={`text-sm font-serif ${
            status === 'Approved'
              ? 'text-green-500'
              : status === 'Rejected'
                ? 'text-red-500'
                : 'text-yellow-500'
          }`}
        >
          {status}
        </h1>{' '}
      </div>

      <hr className="h-0.5 mt-2 bg-gray-400" />
      <div className="flex justify-between items-center p-1">
        <h1 className="text-gray-600 text-sm">Txn Type</h1>
        <h1 className="text-gray-500 text-sm">Withdraw Mode</h1>
      </div>
      <div className="flex justify-between items-center p-1">
        <h1 className="text-red-500 text-sm font-semibold">{txnType}</h1>
        <h1 className="text-gray-700 text-sm font-semibold">{withdrawMode}</h1>
      </div>
    </div>
  );
};

export default WithdrawHistoryCard;
