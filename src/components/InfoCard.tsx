import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  marqueeText: string;
  Icon: LucideIcon;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  marqueeText,
  Icon,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        }
      }}
      className={`
        group relative overflow-hidden
         w-full mx-auto
        bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50
        rounded-2xl shadow-sm hover:shadow-lg
        transition-all duration-500 ease-out
        border border-purple-100
        cursor-pointer
        ${className}
      `}
    >
      {/* Glassmorphism background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute -inset-1/2 bg-gradient-to-r from-purple-200/10 via-pink-200/10 to-purple-200/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Main content container */}
      <div className="relative p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {/* Icon container with animated background */}
          <div className="relative">
            <div className="absolute inset-0 bg-purple-200/30 blur-xl rounded-full group-hover:bg-pink-200/30 transition-colors duration-500" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm group-hover:shadow-md transition-all duration-500">
              <Icon className="w-6 h-6 text-purple-500 group-hover:text-pink-500 transition-colors duration-500" />
            </div>
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-base sm:text-lg text-gray-800 mb-1 group-hover:text-purple-700 transition-colors duration-500">
              {title}
            </h2>
            <p className="text-sm text-gray-500 truncate group-hover:text-gray-600 transition-colors duration-500">
              {marqueeText}
            </p>
          </div>

          {/* Arrow indicator with animation */}
          <div className="relative">
            <div
              className="
              w-8 h-8 rounded-full flex items-center justify-center
              bg-purple-100 group-hover:bg-pink-100
              transition-all duration-500 ease-out
            "
            >
              <ArrowRight
                className="
                w-4 h-4 text-purple-500 group-hover:text-pink-500
                transform group-hover:translate-x-1
                transition-all duration-500 ease-out
              "
              />
            </div>
          </div>
        </div>

        {/* Bottom decoration line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
};

export default InfoCard;
