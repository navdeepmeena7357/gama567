// components/Marquee.tsx
import React from 'react';

interface MarqueeProps {
  text: string;
}

const MarqueeTwo: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee text-sm whitespace-nowrap text-gray-500 ">
        {text}
      </div>
    </div>
  );
};
export default MarqueeTwo;
