import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { MdAddCall } from 'react-icons/md';
import { useAppData } from '@/context/AppDataContext';

const ContactOptions = () => {
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

  const handleCallClick = () => {
    const phoneNumber = contactDetails.contactDetails?.phone_number;
    window.open(`tel:${phoneNumber}`);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={handleWhatsAppClick}
        className="flex-1 bg-white hover:bg-gray-50 border border-gray-200
        flex items-center justify-center gap-2 py-2 px-2 
        rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="bg-green-500 p-1.5 rounded-full">
          <FaWhatsapp className="w-4 h-4 text-white" />
        </div>
        <span className="text-gray-700 text-sm font-medium">
          {contactDetails.contactDetails?.whatsapp_numebr.replace('+91', '')}
        </span>
      </button>

      <button
        onClick={handleCallClick}
        className="flex-1 bg-white hover:bg-gray-50 border border-gray-200
        flex items-center justify-center gap-2 py-2 px-2 
        rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
      >
        <div className="bg-red-500 p-1.5 rounded-full">
          <MdAddCall className="w-4 h-4 text-white" />
        </div>
        <span className="text-gray-700 text-sm font-medium">
          {contactDetails.contactDetails?.phone_number.replace('+91', '')}
        </span>
      </button>
    </div>
  );
};

export default ContactOptions;
