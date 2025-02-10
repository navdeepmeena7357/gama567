'use client';
import React, { useState } from 'react';
import TitleBar from '@/components/TitleBar';
import { SiPhonepe } from 'react-icons/si';
import { FaCopy } from 'react-icons/fa';
import ContactOptions from '@/components/ContactOptions';
import { usePayment } from '@/context/PaymentContext';
import { useAppData } from '@/context/AppDataContext';

interface Translation {
  title: string;
  instruction: string;
  phonepe: string;
  copy: string;
  switchLang: string;
  bonus: string;
}

const translations: Record<string, Translation> = {
  en: {
    title: 'Add Funds',
    instruction:
      'Copy the UPI ID below and make a payment via any UPI app like Google Pay, PhonePe, or Paytm. After payment, send the screenshot to our WhatsApp number.',
    phonepe: 'UPI ID:',
    copy: 'Copy',
    switchLang: 'Switch Language',
    bonus: 'Get an 5% exclusive bonus on deposits via UPI!',
  },
  hi: {
    title: 'फंड जमा',
    instruction:
      'नीचे दिए गए UPI ID को कॉपी करें और Google Pay, PhonePe, या Paytm जैसे किसी भी UPI ऐप से भुगतान करें। भुगतान के बाद, स्क्रीनशॉट हमारे व्हाट्सएप नंबर पर भेजें।',
    phonepe: 'UPI आईडी:',
    copy: 'कॉपी करें',
    switchLang: 'भाषा बदलें',
    bonus: 'UPI के माध्यम से जमा पर 5% बोनस प्राप्त करें!',
  },
  ta: {
    title: 'நிதியை சேர்',
    instruction:
      'கீழே உள்ள UPI ஐடியைப் பிழிந்து Google Pay, PhonePe, அல்லது Paytm போன்ற எந்த UPI பயன்பாட்டிலும் செலுத்துங்கள். கட்டணத்திற்குப் பிறகு, திரைப்பிடிப்பை எங்கள் வாட்ஸ்அப் எண்ணுக்கு அனுப்பவும்.',
    phonepe: 'UPI ஐடி:',
    copy: 'நகலெடு',
    switchLang: 'மொழியை மாற்றவும்',
    bonus: ' 5% UPI மூலம் டெபாசிட் செய்யும் போது சிறப்பு போனஸ் பெறுங்கள்!',
  },
  te: {
    title: 'నిధులను జోడించండి',
    instruction:
      'కింద ఉన్న UPI ID ను కాపీ చేసి Google Pay, PhonePe, లేదా Paytm ద్వారా చెల్లించండి. చెల్లింపు తర్వాత, స్క్రీన్‌షాట్‌ను మా WhatsApp నంబర్‌కు పంపండి.',
    phonepe: 'UPI ID:',
    copy: 'కాపీ చేయండి',
    switchLang: 'భాషను మార్చండి',
    bonus: ' 5% UPI ద్వారా డిపాజిట్‌పై ప్రత్యేకమైన బోనస్ పొందండి!',
  },
};

const AddFundPage: React.FC = () => {
  const pInfo = usePayment();
  const appData = useAppData();

  const [language, setLanguage] = useState<string>('en');
  const t: Translation = translations[language];
  const upiId = pInfo.paymentDetails?.upi_id;

  const switchLanguage = (): void => {
    const langs = Object.keys(translations);
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId!);
    alert('UPI ID copied to clipboard!');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2 ">
      <TitleBar title={t.title} />
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center mt-12">
        <p className="text-gray-700 mb-4 text-sm">{t.instruction}</p>

        <p className="mt-4 text-sm font-semibold text-red-500 italic animate-pulse">
          {t.bonus}
        </p>

        <div className="text-black text-sm font-semibold mt-2">
          Account Name : {pInfo.paymentDetails?.business_name}
          <div className="text-red-500 text-sm p-2">
            Minimum Deposit : {pInfo.paymentDetails?.min_amount}
          </div>
        </div>
        <div
          className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 bg-purple-200 p-2.5 rounded-lg cursor-pointer shadow-md hover:bg-purple-300 transition"
          onClick={copyToClipboard}
        >
          <SiPhonepe className="text-purple-600" />
          {t.phonepe} <span className="text-purple-600">{upiId}</span>
          <FaCopy className="text-gray-600" />
        </div>

        <div className="p-3 font-semibold text-purple-600">OR</div>

        <div
          className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-900 bg-pink-200 p-3 rounded-lg cursor-pointer shadow-md hover:bg-pink-300 transition"
          onClick={copyToClipboard}
        >
          <SiPhonepe className="text-pink-600" />
           Pay Number :
          <span className="text-pink-600">
            {appData.contactDetails?.phone_number.replace(/^\+91/, '')}
          </span>
          <FaCopy className="text-gray-600" />
        </div>
        <br />
        <ContactOptions />
        <button
          onClick={switchLanguage}
          className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition"
        >
          {t.switchLang}
        </button>
      </div>
    </div>
  );
};

export default AddFundPage;
