import React from 'react';
import { MessageCircle, RotateCw } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

interface ContactOptionsProps {
  onRefresh: () => void;
}

const ContactRefresh: React.FC<ContactOptionsProps> = ({ onRefresh }) => {
  const contactDetails = useAppData();

  const handleWhatsAppClick = () => {
    const rawPhoneNumber = contactDetails.contactDetails?.whatsapp_numebr;
    const phoneNumber = rawPhoneNumber ? rawPhoneNumber.replace(/\D/g, '') : '';
    if (!phoneNumber) {
      alert('Phone number is not available.');
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="grid grid-cols-2 gap-2 m-2">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center justify-center gap-2 px-3 py-2 
          bg-gradient-to-r from-red-500 to-red-600
          hover:from-red-600 hover:to-red-700
          text-white rounded-lg
          transform transition-all duration-200
          active:scale-[0.98] shadow-lg shadow-red-500/20
          border border-white/10"
      >
        <div className="bg-white/20 p-1.5 rounded-md backdrop-blur-sm">
          <MessageCircle className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold italic">Chat Now</span>
      </button>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="flex items-center shadow-gray-300 justify-center gap-2 px-3 py-2
          from-red-500 to-red-600 backdrop-blur-sm
          text-black rounded-lg
          transform transition-all duration-200
          active:scale-[0.98] shadow-sm
          group border "
        aria-label="Refresh"
      >
        <div className="bg-white/20 p-1.5 rounded-md">
          <RotateCw
            className="w-3.5 h-3.5 transition-transform duration-500 
              group-hover:rotate-180"
          />
        </div>
        <span className="text-xs font-bold italic">Refresh</span>
      </button>
    </div>
  );
};

export default ContactRefresh;
