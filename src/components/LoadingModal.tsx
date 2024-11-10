import React from 'react';

interface LoadingModalProps {
  isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className=" p-5 rounded">
        <div className="flex justify-center">
          <div className="loader"></div>
        </div>
      </div>
      <style jsx>{`
        .loader {
          border: 5px solid #f3f3f3; /* Light grey */
          border-top: 5px solid #ea580c; /* Blue */
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingModal;
