import React from 'react';

interface AlertModalProps {
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center text-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-80">
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          className="bg-orange-500 text-white rounded px-4 py-1 hover:bg-orange-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
