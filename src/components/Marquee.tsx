import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div
      className="bg-gradient-to-r from-red-600 to-red-700
      border-y border-white/20 py-1.5 overflow-hidden relative"
    >
      {/* Fade Edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 
        bg-gradient-to-r from-red-600 to-transparent z-10"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 
        bg-gradient-to-l from-red-700 to-transparent z-10"
      />

      {/* Scrolling Content */}
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'marquee 20s linear infinite',
          paddingLeft: '100%',
        }}
      >
        <span className="inline-flex items-center gap-3 mx-4">
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          <span className="text-xs font-bold italic text-white">{text}</span>
        </span>
        <span className="inline-flex items-center gap-3 mx-4">
          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
          <span className="text-xs font-bold italic text-white">{text}</span>
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
