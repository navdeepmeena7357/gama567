import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

const ContactOptions = () => {
  const { contactDetails } = useAppData();

  const handleWhatsAppClick = () => {
    const rawPhoneNumber = contactDetails?.whatsapp_numebr;
    const phoneNumber = rawPhoneNumber ? rawPhoneNumber.replace(/\D/g, '') : '';
    if (!phoneNumber) {
      alert('Phone number is not available.');
      return;
    }
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="space-y-3 max-w-md mx-auto w-full">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group relative overflow-hidden bg-white/10 
          w-full p-4 rounded-xl transition-all duration-300
          border-2 border-red-400/30 hover:border-red-400/50
          backdrop-blur-sm flex items-center"
      >
        {/* Background Decoration */}
        <div
          className="absolute -right-6 -top-6 w-12 h-12 bg-red-500/20
            rounded-full group-hover:scale-150 transition-transform duration-300"
        />

        {/* Icon Container */}
        <div className="relative mr-4">
          <div
            className="bg-white p-2.5 rounded-xl shadow-lg
              shadow-black/10 group-hover:scale-110 transition-transform duration-200"
          >
            <MessageCircle className="w-5 h-5 text-red-600" />
          </div>
        </div>

        {/* Label Container */}
        <div className="relative flex-1">
          <p className="text-sm font-medium text-red-200 italic">
            WhatsApp Support
          </p>
          <p className="text-lg font-bold text-white italic">
            {contactDetails?.whatsapp_numebr?.replace('+91', '') ||
              '1234567890'}
          </p>
        </div>

        {/* Arrow Indicator */}
        <div className="relative ml-2">
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors">
            <span className="text-white text-lg">→</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ContactOptions;
