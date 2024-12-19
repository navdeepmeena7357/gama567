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
    <div className="max-w-sm mx-auto mt-10">
      <div
        className="relative bg-gradient-to-br from-slate-900 to-slate-800 
        rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div
            className="absolute top-0 right-0 w-48 h-48 
            bg-gradient-to-br from-purple-600/20 to-blue-600/20 
            rounded-full blur-3xl transform translate-x-20 -translate-y-20"
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 
            bg-gradient-to-br from-emerald-600/20 to-teal-600/20 
            rounded-full blur-3xl transform -translate-x-20 translate-y-20"
          />
        </div>

        {/* Card Content */}
        <div className="relative">
          {/* User Info Section */}
          <div className="p-6 pb-4">
            <div className="flex flex-col items-center text-center">
              {/* Avatar Circle */}
              <div
                className="w-20 h-20 mb-4 rounded-full 
                bg-gradient-to-br from-slate-700 to-slate-800
                flex items-center justify-center
                border-4 border-slate-700 shadow-lg"
              >
                <span className="text-2xl font-bold text-slate-300">
                  {user?.name?.[0]?.toUpperCase() ?? '...'}
                </span>
              </div>

              {/* User Details */}
              <h2 className="text-lg font-bold text-white mb-1">
                {user?.name ?? '...'}
              </h2>
              <p className="text-slate-400 text-sm">
                {user?.username ?? '...'}
              </p>
            </div>
          </div>

          {/* Balance Section */}
          <div className="px-6 pb-6">
            <div
              className="bg-slate-800/50 rounded-xl p-4 
              backdrop-blur-sm border border-slate-700/50"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <MdAccountBalanceWallet className="text-emerald-400 h-8 w-8" />
                </div>
                <div>
                  <div className="flex items-center text-2xl font-bold text-white mb-1">
                    <BiRupee className="h-6 w-6 text-emerald-400" />
                    <span>{balance ?? '...'}</span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium">
                    Current Balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
