import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import MarqueeTwo from './MarqueeTwo';

interface InfoCardProps {
  title: string;
  marqueeText: string;
  Icon: React.ComponentType<{ className?: string }>; // Update Icon to accept className
  onClick: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  marqueeText,
  Icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow-sm p-1 flex items-center justify-between border-s-4 border-s-green-500 shadow-gray-300 rounded-sm"
    >
      <div className="m-2 flex gap-2">
        <Icon className="w-12 h-12 rounded-full bg-gray-100 p-3 text-green-500" />
        <div>
          <h1 className="font-semibold">{title}</h1>
          <MarqueeTwo text={marqueeText} />
        </div>
      </div>
      <div className="m-2">
        <IoIosArrowForward className="w-12 h-12 rounded-full bg-gray-100 p-3 text-green-500" />
      </div>
    </div>
  );
};

export default InfoCard;
