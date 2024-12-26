import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

const ContactOptions = () => {
  const { contactDetails } = useAppData();

  const formatPhoneNumber = (number: string | undefined) => {
    if (!number) return '';
    const cleaned = number.replace(/\D/g, '');
    return cleaned.startsWith('91') ? cleaned : `91${cleaned}`;
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = formatPhoneNumber(contactDetails?.whatsapp_numebr);

    if (!phoneNumber) {
      alert('WhatsApp number is not available.');
      return;
    }

    try {
      window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    } catch {
      window.location.href = `https://wa.me/${phoneNumber}`;
    }
  };

  return (
    <div className="max-w-md mx-auto w-full p-3">
      <button
        onClick={handleWhatsAppClick}
        className="group relative w-full bg-gradient-to-br from-red-50 to-pink-50 
          rounded-xl border border-red-100
          overflow-hidden transition-all duration-300
          hover:border-red-200 hover:shadow-lg
          active:scale-[0.98]"
      >
        {/* Main Content Container */}
        <div className="relative flex items-center p-4 gap-4">
          {/* Icon Container */}
          <div
            className="bg-gradient-to-r from-red-500 to-pink-500 
            p-2.5 rounded-xl shadow-sm
            group-hover:shadow-md group-hover:scale-105 
            transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-red-600 mb-0.5">
              WhatsApp Support
            </p>
            <p
              className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-600 
              bg-clip-text text-transparent"
            >
              {contactDetails?.whatsapp_numebr?.replace('+91', '') ||
                'Contact Support'}
            </p>
          </div>

          {/* Arrow Icon */}
          <div className="relative">
            <ArrowUpRight
              className="w-5 h-5 text-red-500 transform 
                group-hover:translate-x-0.5 group-hover:-translate-y-0.5 
                transition-transform duration-300"
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          className="absolute -right-8 -top-8 w-16 h-16 
          bg-gradient-to-br from-red-500/10 to-pink-500/10 
          rounded-full transform group-hover:scale-150 
          transition-transform duration-500"
        />
        <div
          className="absolute -left-8 -bottom-8 w-16 h-16 
          bg-gradient-to-tl from-pink-500/10 to-red-500/10 
          rounded-full transform group-hover:scale-150 
          transition-transform duration-500"
        />
      </button>
    </div>
  );
};

export default ContactOptions;
