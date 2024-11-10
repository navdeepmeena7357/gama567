import React from 'react';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { BiRupee } from 'react-icons/bi';

interface UserCardProps {
  user: {
    name: string;
    username: string;
  };
  balance: number | string;
}

const UserCard: React.FC<UserCardProps> = ({ user, balance }) => {
  return (
    <div className="max-w-sm mx-auto mt-10 bg-white rounded-lg overflow-hidden card-shadow">
      <div className="">
        <div className="flex justify-between items-center">
          <div className="p-5"></div>
        </div>
        <div className="bg-black p-2">
          <div className="flex flex-col items-center justify-between text-white font-semibold">
            <p className="font-medium">{user?.name ?? '...'}</p>
            <p>{user?.username ?? '...'}</p>
          </div>
        </div>
        <div className="text-start flex gap-2 m-2">
          <MdAccountBalanceWallet className="text-orange-500 h-12 w-12" />
          <div>
            <h1 className="text-orange-500 font-semibold text-xl flex items-center">
              <BiRupee className="h-6 w-6" /> {balance ?? '...'}
            </h1>
            <h1 className="text-sm text-gray-500">Current Balance</h1>
          </div>
        </div>
        <div className="p-3"></div>
      </div>
    </div>
  );
};

export default UserCard;
