import React from 'react';
import { useAppData } from '@/context/AppDataContext';
import { MessageCircle, RotateCw } from 'lucide-react';

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

    window.location.href = `whatsapp://send?phone=${phoneNumber}`;
  };

  const buttonBaseClasses = `
    flex-1 rounded-xl py-3 px-4
    flex items-center justify-center gap-3
    transition-all duration-200 
    transform hover:scale-[1.02] active:scale-[0.98]
    shadow-sm hover:shadow-md
  `;

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={handleWhatsAppClick}
        className={`
          ${buttonBaseClasses}
          bg-gradient-to-r from-green-500 to-green-600
          hover:from-green-600 hover:to-green-700
          text-white
        `}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium text-sm">Whatsapp Support</span>
      </button>

      <button
        onClick={onRefresh}
        className={`
          ${buttonBaseClasses}
          bg-white hover:bg-gray-50 
          border border-gray-200 
          group
        `}
        aria-label="Refresh"
      >
        <RotateCw
          className="w-5 h-5 text-gray-600 
            group-hover:text-gray-800
            transition-transform duration-200 
            group-hover:rotate-180"
        />
        <span className="font-medium text-sm text-gray-600 group-hover:text-gray-800">
          Refresh
        </span>
      </button>
    </div>
  );
};

export default ContactRefresh;
