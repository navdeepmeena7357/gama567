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
            <div className="absolute w-16 h-16 rounded-full border-4 border-gray-200"></div>
            <div className="absolute w-16 h-16 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
          </div>
        );

      case 'pulse':
        return (
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-150"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-200"></div>
          </div>
        );

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        );

      case 'progress':
        return (
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-progress"></div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-[200px]">
        {renderLoader()}
        {message && (
          <p className="text-gray-600 text-sm font-medium">{message}</p>
        )}
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-progress {
          animation: progress 1.5s linear infinite;
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

// Demo Component
export const LoadingModalDemo = () => {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="font-medium">Spinner Variant</h3>
        <LoadingModal
          isOpen={true}
          variant="spinner"
          message="Loading data..."
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Pulse Variant</h3>
        <LoadingModal isOpen={true} variant="pulse" message="Please wait..." />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Dots Variant</h3>
        <LoadingModal isOpen={true} variant="dots" message="Processing..." />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Progress Variant</h3>
        <LoadingModal isOpen={true} variant="progress" message="Uploading..." />
      </div>
    </div>
  );
};

export default LoadingModal;
