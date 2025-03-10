
import React from 'react';
import { PawPrint } from 'lucide-react';

const ExpoHeader: React.FC = () => {
  return (
    <header className="bg-white p-6 md:p-8 xl:p-10 rounded-2xl shadow-md mb-8 md:mb-10 xl:mb-12 animate-fade-in w-full max-w-5xl mx-auto relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <img 
          src="/lovable-uploads/bcd15026-fb08-4f78-904d-16acee8427c3.png" 
          alt="Cat and Dog" 
          className="h-40 md:h-48 xl:h-56 w-auto animate-float"
        />
      </div>
      
      <div className="flex flex-col items-center justify-center mt-16 md:mt-20 xl:mt-24">
        <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-expo-purple mb-2">
          LOOK LOOK มาแล้ว!
        </h1>
        <p className="text-2xl md:text-3xl xl:text-4xl font-bold text-expo-orange mb-4">
          ดาวน์โหลดเลย!
        </p>
        <p className="text-lg md:text-xl xl:text-2xl text-gray-600 mb-6 max-w-2xl text-center">
          ดูแลสัตว์เลี้ยงด้วย AI ที่รู้ลึก ๆ ของคุณมากที่สุด!
        </p>
        
        <div className="flex space-x-4">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
            alt="Download on App Store" 
            className="h-12 md:h-14 xl:h-16"
          />
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
            alt="Get it on Google Play" 
            className="h-12 md:h-14 xl:h-16"
          />
        </div>
      </div>
    </header>
  );
};

export default ExpoHeader;
