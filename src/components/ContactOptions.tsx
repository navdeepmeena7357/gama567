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
        className="group relative overflow-hidden bg-white/80 
          w-full p-4 rounded-xl transition-all duration-300
          border border-purple-200 hover:border-purple-300
          hover:shadow-md shadow-sm backdrop-blur-sm flex items-center
          active:scale-[0.99]"
      >
        {/* Background Decoration */}
        <div
          className="absolute -right-6 -top-6 w-12 h-12 
            bg-gradient-to-br from-purple-100 to-pink-100
            rounded-full group-hover:scale-150 transition-transform duration-500"
        />

        {/* Icon Container */}
        <div className="relative mr-4">
          <div
            className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl 
              shadow-lg shadow-purple-500/10 
              group-hover:scale-110 transition-transform duration-300"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Label Container */}
        <div className="relative flex-1">
          <p className="text-sm font-medium text-purple-600">
            WhatsApp Support
          </p>
          <p className="text-lg font-bold text-purple-700">
            {contactDetails?.whatsapp_numebr?.replace('+91', '') ||
              '1234567890'}
          </p>
        </div>

        {/* Arrow Indicator */}
        <div className="relative ml-2">
          <div
            className="w-8 h-8 rounded-full 
            bg-gradient-to-r from-purple-50 to-pink-50 
            flex items-center justify-center 
            group-hover:from-purple-100 group-hover:to-pink-100 
            transition-all duration-300
            border border-purple-200"
          >
            <span
              className="text-purple-600 text-lg font-medium 
              transform group-hover:translate-x-0.5 transition-transform"
            >
              →
            </span>
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-purple-50/50
          opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </button>
    </div>
  );
};

export default ContactOptions;
