import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee whitespace-nowrap font-semibold text-orange-600">
        {text}
      </div>
    </div>
  );
};

export default Marquee;
