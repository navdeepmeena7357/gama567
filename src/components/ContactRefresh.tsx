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
    <div className="grid grid-cols-2 gap-4 p-2">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group relative flex items-center justify-center gap-3
          bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600
          hover:from-pink-600 hover:via-purple-600 hover:to-purple-700
          p-2 rounded-xl
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          shadow-lg hover:shadow-xl shadow-pink-500/20
          overflow-hidden"
      >
        {/* Animated Background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
          blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          animate-pulse"
        />

        {/* Icon Container */}
        <div
          className="relative flex items-center justify-center 
          bg-white/10 backdrop-blur-md p-2 rounded-lg
          ring-1 ring-white/20 
          group-hover:ring-white/30 group-hover:scale-110 
          transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4 text-white" />
        </div>

        {/* Text Container */}
        <span className="relative text-sm text-white font-medium">
          Chat Now
        </span>
      </button>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="group relative flex items-center justify-center gap-3
          bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800
          hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
          p-2 rounded-xl
          transform transition-all duration-500 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          shadow-sm hover:shadow-sm shadow-white
          overflow-hidden"
        aria-label="Refresh"
      >
        {/* Animated Background */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0
          blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          animate-pulse"
        />

        {/* Icon Container */}
        <div
          className="relative flex items-center justify-center 
          bg-white/10 backdrop-blur-md p-2 rounded-lg
          ring-1 ring-white/20 
          group-hover:ring-white/30 group-hover:scale-110 
          transition-all duration-300"
        >
          <RotateCw
            className="w-4 h-4 text-pink-300 transition-all duration-700 
              group-hover:rotate-180"
          />
        </div>

        {/* Text Container */}
        <span className="relative text-sm text-pink-300 font-medium">
          Refresh
        </span>
      </button>
    </div>
  );
};
export default ContactRefresh;
