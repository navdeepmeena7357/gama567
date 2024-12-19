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
    <div className="grid grid-cols-2 gap-2">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center justify-center gap-2 px-3 py-2 
          bg-gradient-to-r from-emerald-500 to-emerald-600 
          hover:from-emerald-600 hover:to-emerald-700
          text-white rounded-xl
          transform transition-all duration-200
          active:scale-[0.98] shadow-sm"
      >
        <div className="bg-white/20 p-1.5 rounded-lg">
          <MessageCircle className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Chat Now</span>
      </button>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="flex items-center justify-center gap-2 px-3 py-2
          bg-gradient-to-r from-violet-500 to-purple-500
          hover:from-violet-600 hover:to-purple-600
          text-white rounded-xl
          transform transition-all duration-200
          active:scale-[0.98] shadow-sm
          group"
        aria-label="Refresh"
      >
        <div className="bg-white/20 p-1.5 rounded-lg">
          <RotateCw
            className="w-4 h-4 transition-transform duration-500 
              group-hover:rotate-180"
          />
        </div>
        <span className="text-sm font-medium">Refresh</span>
      </button>
    </div>
  );
};

export default ContactRefresh;
