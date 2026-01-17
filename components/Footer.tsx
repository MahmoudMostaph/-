
import React from 'react';
import { MapPinIcon } from './Icons';

const Footer: React.FC = () => {
  const mapUrl = "https://www.google.com/maps/search/?api=1&query=Tabuk+Al+Murooj+Abu+Bakr+As+Siddiq+Street";

  return (
    <footer className="bg-gray-800 text-gray-400 mt-12 py-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-4">
          <MapPinIcon className="w-6 h-6 text-yellow-400 ml-3" />
          <h5 className="font-bold text-lg text-white">موقعنا</h5>
        </div>
        <p className="mb-2">
          المملكة العربية السعودية - تبوك - حي المروج - شارع أبو بكر الصديق
        </p>
        <p className="mb-4">مقابل قاعة تركواز ووقت اللياقة</p>
        
        <a 
          href={mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-full transition-colors mb-6 border border-gray-600"
        >
          <MapPinIcon className="w-4 h-4 ml-2" />
          عرض الموقع على الخريطة
        </a>

        <div className="border-t border-gray-700 pt-6">
          <p>&copy; {new Date().getFullYear()} حلم الوزن والرشاقة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
