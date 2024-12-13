import React from 'react';
import { ChevronRight } from 'lucide-react';

interface InfoCardProps {
  title: string;
  marqueeText: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  onClick: () => void;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  marqueeText,
  Icon,
  onClick,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-l-green-500 hover:border-l-green-600';
      case 'warning':
        return 'border-l-orange-500 hover:border-l-orange-600';
      case 'error':
        return 'border-l-red-500 hover:border-l-red-600';
      default:
        return 'border-l-red-500 hover:border-l-red-600';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-green-500 bg-green-50 group-hover:bg-green-100';
      case 'warning':
        return 'text-orange-500 bg-orange-50 group-hover:bg-orange-100';
      case 'error':
        return 'text-red-500 bg-red-50 group-hover:bg-red-100';
      default:
        return 'text-red-500 bg-red-50 group-hover:bg-red-100';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        group relative bg-white rounded-lg shadow-sm 
        transition-all duration-200 ease-in-out
        hover:shadow-md active:shadow-sm active:scale-[0.995]
        border-l-4 ${getVariantStyles()}
        cursor-pointer overflow-hidden
      `}
    >
      <div className="p-4 flex items-center justify-between gap-4">
        {/* Icon Section */}
        <div
          className={`
          rounded-full p-3
          transition-colors duration-200
          ${getIconStyles()}
        `}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 mb-1">{title}</h2>
          <div className="text-sm text-gray-600 truncate">{marqueeText}</div>
        </div>

        {/* Arrow Section */}
        <div
          className={`
          rounded-full p-2
          transition-colors duration-200
          ${getIconStyles()}
        `}
        >
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.02] transition-opacity duration-200" />
    </div>
  );
};

// Usage Example
export const InfoCardDemo = () => {
  const DemoIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div className="space-y-4 p-4">
      <InfoCard
        title="Default Card"
        marqueeText="This is a default info card"
        Icon={DemoIcon}
        onClick={() => console.log('clicked')}
      />
      <InfoCard
        title="Success Card"
        marqueeText="This is a success info card"
        Icon={DemoIcon}
        onClick={() => console.log('clicked')}
        variant="success"
      />
      <InfoCard
        title="Warning Card"
        marqueeText="This is a warning info card"
        Icon={DemoIcon}
        onClick={() => console.log('clicked')}
        variant="warning"
      />
      <InfoCard
        title="Error Card"
        marqueeText="This is an error info card"
        Icon={DemoIcon}
        onClick={() => console.log('clicked')}
        variant="error"
      />
    </div>
  );
};

export default InfoCard;
