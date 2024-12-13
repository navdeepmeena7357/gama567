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
    <li className="relative group">
      <a
        href={href}
        onClick={onClick}
        className="flex items-center space-x-4 px-6 py-3 text-gray-700 hover:bg-red-50 transition-all duration-200"
      >
        <Icon className="w-5 h-5 text-red-600" />
        <span className="font-medium text-sm">{label}</span>
      </a>
      <div className="absolute left-0 w-1 h-full bg-red-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-200" />
    </li>
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 backdrop-blur-sm ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white w-[280px] h-full absolute left-0 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <X className="w-5 h-5 text-red-600" />
        </button>

        {/* User Profile Section */}
        <div className="pt-6 pb-8 px-6 bg-gradient-to-br from-red-500 to-red-600">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h2 className="font-bold text-lg">{user?.name}</h2>
              <p className="text-red-100 text-sm">{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-2">
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
        <div className="absolute bottom-0 w-full border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 px-6 py-4 w-full hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="font-medium text-sm text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
