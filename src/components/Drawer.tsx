import React from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Wallet,
  Clock,
  LogOut,
  Key,
  BarChart3,
  ClipboardList,
  IndianRupee,
  Info,
  X,
} from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { user, logoutUser } = useUser();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
      logoutUser();
      router.replace('/auth/login');
    } catch (err) {
      console.error(err);
    }
  };

  const MenuItem = ({
    icon: Icon,
    label,
    href,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    href?: string;
    onClick?: () => void;
  }) => (
    <li className="group">
      <a
        href={href}
        onClick={onClick}
        className="relative flex items-center space-x-4 px-6 py-4 
          text-red-50 transition-all duration-300
          hover:bg-gradient-to-r hover:from-red-900/50 hover:to-transparent
          overflow-hidden"
      >
        {/* Hover Glow Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Icon Container */}
        <div
          className="relative z-10 p-2 rounded-lg 
          bg-gradient-to-br from-red-800/50 to-red-900/50
          group-hover:from-red-700 group-hover:to-red-800
          transition-colors duration-300"
        >
          <Icon
            className="w-5 h-5 text-red-200 
            transform transition-all duration-300
            group-hover:scale-110 group-hover:text-red-100"
          />
        </div>

        {/* Label */}
        <span
          className="relative z-10 font-medium text-sm 
          transform transition-all duration-300
          group-hover:translate-x-1"
        >
          {label}
        </span>

        {/* Active Indicator */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-red-400
          transform scale-y-0 group-hover:scale-y-100
          transition-transform duration-300 origin-top"
        />
      </a>
    </li>
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 backdrop-blur-lg
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`w-[300px] h-full absolute left-0 
          bg-gradient-to-b from-red-950 to-red-900
          shadow-[0_0_40px_rgba(220,38,38,0.2)]
          transition-transform duration-500 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full 
            bg-red-800/50 hover:bg-red-700/50
            transition-all duration-300 hover:rotate-90
            group"
        >
          <X
            className="w-5 h-5 text-red-200 
            transition-transform duration-300
            group-hover:scale-110"
          />
        </button>

        {/* User Profile Section */}
        <div
          className="pt-8 pb-10 px-6 
          bg-gradient-to-br from-red-800 to-red-900
          border-b border-red-800/50"
        >
          <div className="flex items-center space-x-4">
            <div
              className="p-4 rounded-xl
              bg-gradient-to-br from-red-700/50 to-red-800/50
              shadow-lg shadow-red-900/50"
            >
              <User className="w-8 h-8 text-red-100" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-red-50 mb-1">
                {user?.name}
              </h2>
              <p className="text-red-300 text-sm font-medium">
                {user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-4">
          <ul className="space-y-1">
            {user?.isVerified && (
              <>
                <MenuItem
                  icon={ClipboardList}
                  label="My Bids"
                  href="/features/bids"
                />
                <MenuItem icon={Wallet} label="Funds" href="/features/funds" />
                <MenuItem
                  icon={IndianRupee}
                  label="Game Rate"
                  href="/features/game_rate"
                />
              </>
            )}
            <MenuItem icon={BarChart3} label="Charts" href="/features/chart" />
            <MenuItem
              icon={Clock}
              label="Time Table"
              href="/features/time-table"
            />
            {user?.isVerified && (
              <MenuItem
                icon={Info}
                label="Notice Board/Rules"
                href="/features/rules"
              />
            )}
            <MenuItem
              icon={Key}
              label="Change Password"
              href="/features/password"
            />
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-0 w-full border-t border-red-800/30">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 px-6 py-5 w-full
              text-red-100 bg-gradient-to-r from-red-900 to-red-950
              hover:from-red-800 hover:to-red-900
              transition-all duration-300 group"
          >
            <div
              className="p-2 rounded-lg bg-red-800/50 
              group-hover:bg-red-700/50 transition-colors duration-300"
            >
              <LogOut
                className="w-5 h-5 text-red-200
                transform transition-transform duration-300
                group-hover:scale-110 group-hover:-rotate-12"
              />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
