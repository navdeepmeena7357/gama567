import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div
      className="relative bg-gradient-to-r from-red-700 via-red-800 to-red-900
      border-y border-red-300/20 py-2 overflow-hidden"
    >
      {/* Fade Edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-12 
        bg-gradient-to-r from-red-700 to-transparent z-10"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-12 
        bg-gradient-to-l from-red-900 to-transparent z-10"
      />

      {/* Glowing Line Effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-red-500/10 to-pink-500/0
        animate-pulse"
      />

      {/* Scrolling Content */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'marquee 30s linear infinite',
          paddingLeft: '100%',
        }}
      >
        <span className="inline-flex items-center gap-4 mx-6">
          <span
            className="flex h-2 w-2 rounded-full bg-pink-400 
            shadow-lg shadow-pink-500/50 animate-pulse"
          />
          <span className="text-sm font-medium text-white tracking-wide">
            {text}
          </span>
        </span>
        <span className="inline-flex items-center gap-4 mx-6">
          <span
            className="flex h-2 w-2 rounded-full bg-pink-400 
            shadow-lg shadow-pink-500/50 animate-pulse"
          />
          <span className="text-sm font-medium text-white tracking-wide">
            {text}
          </span>
        </span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation-duration: 0s;
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
