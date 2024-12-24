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
  ChevronRight,
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
    <li>
      <a
        href={href}
        onClick={onClick}
        className="group flex items-center gap-3 px-4 py-3.5 
          text-purple-900 transition-all duration-300
          hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent
          rounded-r-2xl relative overflow-hidden"
      >
        {/* Hover Indicator */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-purple-400
          origin-left scale-y-0 group-hover:scale-y-100 
          transition-transform duration-300"
        />

        {/* Icon */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl
          bg-purple-100 group-hover:bg-purple-200
          transition-colors duration-300"
        >
          <Icon
            className="w-5 h-5 text-purple-600 
            group-hover:text-purple-700 transition-colors"
          />
        </div>

        {/* Label */}
        <span className="text-sm font-medium flex-1">{label}</span>

        {/* Arrow */}
        <ChevronRight
          className="w-4 h-4 text-purple-400 opacity-0 
          group-hover:opacity-100 transition-all duration-300
          transform group-hover:translate-x-1"
        />
      </a>
    </li>
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 
        backdrop-blur-lg bg-purple-950/30
        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className={`w-[320px] h-full absolute left-0 
          bg-white shadow-2xl shadow-purple-500/10
          transition-transform duration-500 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl
            hover:bg-purple-50 transition-all duration-300
            group"
        >
          <X
            className="w-5 h-5 text-purple-400 
            group-hover:text-purple-600 transition-colors"
          />
        </button>

        {/* User Profile */}
        <div
          className="pt-8 pb-6 px-4 mb-4
          bg-gradient-to-br from-purple-50 to-pink-50"
        >
          <div className="flex items-center gap-4">
            <div
              className="p-4 rounded-2xl bg-white 
              shadow-lg shadow-purple-100/50
              bg-gradient-to-br from-purple-100 to-pink-100"
            >
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-purple-900 mb-0.5">
                {user?.name}
              </h2>
              <p className="text-sm text-purple-500 font-medium">
                {user?.username}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="px-2">
          <ul className="space-y-1">
            {user?.isVerified ? (
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
            ) : (
              <></>
            )}
            <MenuItem icon={BarChart3} label="Charts" href="/features/chart" />
            <MenuItem
              icon={Clock}
              label="Time Table"
              href="/features/time-table"
            />
            {user?.isVerified ? (
              <MenuItem
                icon={Info}
                label="Notice Board/Rules"
                href="/features/rules"
              />
            ) : (
              <></>
            )}
            <MenuItem
              icon={Key}
              label="Change Password"
              href="/features/password"
            />
          </ul>
        </nav>

        {/* Logout Button */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 
          border-t border-purple-100"
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3.5 
              rounded-xl text-white
              bg-gradient-to-r from-purple-500 to-pink-500
              hover:from-purple-600 hover:to-pink-600
              transition-all duration-300 group"
          >
            <LogOut
              className="w-5 h-5 transition-transform duration-300
              group-hover:rotate-12"
            />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
