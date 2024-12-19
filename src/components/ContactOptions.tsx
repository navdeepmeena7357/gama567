import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';
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

  const handleCallClick = () => {
    const phoneNumber = contactDetails?.phone_number;
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className="space-y-4">
      {/* Contact Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="group relative overflow-hidden bg-emerald-50 hover:bg-emerald-100 
            p-4 rounded-2xl transition-all duration-300
            border border-emerald-200 hover:border-emerald-300"
        >
          {/* Background Decoration */}
          <div
            className="absolute -right-6 -top-6 w-12 h-12 bg-emerald-200 
            rounded-full group-hover:scale-150 transition-transform duration-300"
          />

          {/* Icon */}
          <div className="relative flex items-center justify-center mb-2">
            <div
              className="bg-emerald-500 p-2.5 rounded-xl shadow-lg 
              shadow-emerald-200 group-hover:scale-110 transition-transform duration-200"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Label */}
          <div className="relative">
            <p className="text-xs font-medium text-emerald-600 mb-1">
              WhatsApp
            </p>
            <p className="text-sm font-bold text-emerald-700">
              {contactDetails?.whatsapp_numebr.replace('+91', '')}
            </p>
          </div>
        </button>

        {/* Phone Button */}
        <button
          onClick={handleCallClick}
          className="group relative overflow-hidden bg-blue-50 hover:bg-blue-100 
            p-4 rounded-2xl transition-all duration-300
            border border-blue-200 hover:border-blue-300"
        >
          {/* Background Decoration */}
          <div
            className="absolute -right-6 -top-6 w-12 h-12 bg-blue-200 
            rounded-full group-hover:scale-150 transition-transform duration-300"
          />

          {/* Icon */}
          <div className="relative flex items-center justify-center mb-2">
            <div
              className="bg-blue-500 p-2.5 rounded-xl shadow-lg 
              shadow-blue-200 group-hover:scale-110 transition-transform duration-200"
            >
              <Phone className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Label */}
          <div className="relative">
            <p className="text-xs font-medium text-blue-600 mb-1">Phone</p>
            <p className="text-sm font-bold text-blue-700">
              {contactDetails?.phone_number.replace('+91', '')}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ContactOptions;
