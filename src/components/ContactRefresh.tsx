import React from 'react';
import { MessageCircle, ArrowUpRight, RotateCw } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

interface ContactOptionsProps {
  onRefresh: () => void;
}

const ContactRefresh: React.FC<ContactOptionsProps> = ({ onRefresh }) => {
  const { contactDetails } = useAppData();

  const handleWhatsAppClick = () => {
    const phoneNumber = contactDetails?.whatsapp_numebr?.replace(/\D/g, '');

    if (!phoneNumber) {
      alert('Phone number is not available.');
      return;
    }

    try {
      window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    } catch {
      window.location.href = `https://wa.me/${phoneNumber}`;
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="grid grid-cols-2 gap-2 p-2 max-w-md w-full">
        <button
          onClick={handleWhatsAppClick}
          className="relative flex items-center justify-center gap-2 p-3
            bg-red-500 rounded-lg group overflow-hidden
            active:scale-95 transition-all duration-200"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r
            from-transparent via-white/5 to-transparent
            translate-x-[-200%] group-hover:translate-x-[200%]
            transition-transform duration-700"
          />

          <div className="relative bg-white/20 p-1.5 rounded flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
            <ArrowUpRight
              className="absolute -top-1 -right-1 w-3 h-3 text-white
                opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>

          <span className="text-xs font-medium text-white">Support</span>
        </button>

        <button
          onClick={onRefresh}
          className="relative flex items-center justify-center gap-2 p-3
            bg-pink-50 rounded-lg group overflow-hidden
            active:scale-95 transition-all duration-200"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r
            from-transparent via-red-100/50 to-transparent
            translate-x-[-200%] group-hover:translate-x-[200%]
            transition-transform duration-700"
          />

          <div className="relative bg-red-500 p-1.5 rounded flex items-center justify-center">
            <RotateCw
              className="w-4 h-4 text-white
              group-hover:rotate-180 transition-transform duration-500"
            />
          </div>

          <span className="text-xs font-medium text-red-600">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default ContactRefresh;
