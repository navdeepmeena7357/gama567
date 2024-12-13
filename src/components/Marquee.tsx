import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div className="bg-red-50 border-y border-red-100 py-2 overflow-hidden">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'scroll 20s linear infinite',
          paddingLeft: '100%',
        }}
      >
        <span className="text-sm font-medium text-red-600 mx-4">{text}</span>
        <span className="text-sm font-medium text-red-600 mx-4">{text}</span>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
