
import React from 'react';
import { PawPrint } from 'lucide-react';

const ExpoHeader: React.FC = () => {
  return (
    <header className="bg-expo-purple text-white p-4 rounded-lg shadow-md mb-6 animate-fade-in">
      <div className="flex items-center justify-center gap-2">
        <PawPrint className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Pet Expo 2025</h1>
      </div>
      <p className="text-center mt-2 font-medium">Spin & Win with LOOK LOOK!</p>
    </header>
  );
};

export default ExpoHeader;
