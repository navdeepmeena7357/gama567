import React from 'react';

interface ModalProps {
  url: string;
  onClose: () => void;
}

const PaymentModal: React.FC<ModalProps> = ({ url, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg border-4 border-orange-500 w-full max-w-2xl relative">
        <iframe
          src={url}
          style={{ width: '100%', height: '70vh', border: 'none' }}
          title="Payment"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          aria-label="Close Modal"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
