import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div
      className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 
      border-y border-indigo-100/50 py-2 overflow-hidden relative"
    >
      {/* Fade Edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 
        bg-gradient-to-r from-indigo-50 to-transparent z-10"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 
        bg-gradient-to-l from-indigo-50 to-transparent z-10"
      />

      {/* Scrolling Content */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'marquee 25s linear infinite',
          paddingLeft: '100%',
        }}
      >
        <span className="inline-flex items-center gap-3 mx-4">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span
            className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 
            bg-clip-text text-transparent"
          >
            {text}
          </span>
        </span>
        <span className="inline-flex items-center gap-3 mx-4">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          <span
            className="text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 
            bg-clip-text text-transparent"
          >
            {text}
          </span>
        </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
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
