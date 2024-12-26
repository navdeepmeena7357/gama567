import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
  variant?: 'spinner' | 'pulse' | 'dots' | 'progress';
  message?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  variant = 'spinner',
  message = 'Loading...',
}) => {
  if (!isOpen) return null;

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className="relative w-16 h-16">
            <div className="absolute w-16 h-16 rounded-full border-4 border-red-100"></div>
            <div className="absolute w-16 h-16 rounded-full border-4 border-red-500/80 border-t-transparent animate-spin">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-brown-500 opacity-20 blur-lg animate-pulse" />
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-brown-500 animate-pulse"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.4))',
                }}
              />
            ))}
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-brown-500 animate-bounce shadow-lg shadow-purple-500/30"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.3))',
                }}
              />
            ))}
          </div>
        );

      case 'progress':
        return (
          <div className="w-48 h-2 bg-red-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-red-500 via-brown-500 to-red-500 animate-progress">
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with glass effect */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative bg-white/80 backdrop-blur-sm rounded-2xl 
        shadow-xl shadow-red-500/10 p-8 
        flex flex-col items-center gap-4 min-w-[200px]
        border border-red-100"
      >
        {renderLoader()}
        {message && (
          <p
            className="text-gray-700 text-sm font-medium bg-gradient-to-r from-red-600 to-brown-600 
            bg-clip-text text-transparent animate-pulse"
          >
            {message}
          </p>
        )}
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-200%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
        .animate-progress {
          animation: progress 2s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
        .delay-75 {
          animation-delay: 0.075s;
        }
        .delay-150 {
          animation-delay: 0.15s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
