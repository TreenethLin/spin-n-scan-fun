
import React, { useState } from 'react';
import ExpoHeader from '@/components/ExpoHeader';
import StepProgress from '@/components/StepProgress';
import QrScanner from '@/components/QrScanner';
import SpinWheel from '@/components/SpinWheel';
import RewardClaim from '@/components/RewardClaim';
import { Button } from "@/components/ui/button";
import { RefreshCw, PawPrint } from 'lucide-react';

const STEPS = [
  "Verify Account",
  "Spin the Wheel",
  "Claim Reward"
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEligible, setIsEligible] = useState(true);
  const [prize, setPrize] = useState<string | null>(null);
  
  const handleQrScanComplete = (isExistingUser: boolean) => {
    if (isExistingUser) {
      setCurrentStep(1); // Move to Spin the Wheel step
    } else {
      setIsEligible(false);
    }
  };
  
  const handlePrizeWon = (prizeWon: string) => {
    setPrize(prizeWon);
    setCurrentStep(2); // Move to Claim Reward step
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setIsEligible(true);
    setPrize(null);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-expo-background">
      <div className="w-full max-w-6xl flex flex-col items-center min-h-screen justify-center">
        <ExpoHeader />
        
        <div className="w-full">
          <StepProgress currentStep={currentStep} steps={STEPS} />
          
          {!isEligible ? (
            <div className="bg-white p-8 md:p-10 xl:p-12 rounded-2xl shadow-md text-center animate-fade-in max-w-3xl mx-auto">
              <PawPrint className="h-16 w-16 md:h-20 md:w-20 xl:h-24 xl:w-24 text-expo-orange mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-6 text-expo-purple">We're Sorry!</h2>
              <p className="mb-6 text-lg md:text-xl xl:text-2xl text-gray-600">
                You're not eligible to spin the wheel. This could be because:
              </p>
              <ul className="text-left mb-8 list-disc pl-8 md:text-lg xl:text-xl text-gray-600 max-w-xl mx-auto">
                <li className="mb-3">You've already used your spin</li>
                <li className="mb-3">You need to create a LOOK LOOK account</li>
                <li className="mb-3">Your QR code couldn't be verified</li>
              </ul>
              <Button onClick={handleReset} size="lg" className="bg-expo-orange hover:bg-expo-orange/90 text-white flex items-center gap-2 text-lg md:text-xl rounded-full px-8 py-6">
                <RefreshCw className="h-6 w-6 md:h-7 md:w-7" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              {currentStep === 0 && <QrScanner onScanComplete={handleQrScanComplete} />}
              
              {currentStep === 1 && <SpinWheel onPrizeWon={handlePrizeWon} />}
              
              {currentStep === 2 && prize && <RewardClaim prize={prize} />}
            </div>
          )}
          
          {(currentStep === 2 || !isEligible) && (
            <div className="mt-8 md:mt-10 xl:mt-12 text-center">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2 text-lg md:text-xl p-6 md:p-8 border-2 border-expo-purple text-expo-purple hover:bg-expo-purple/10 rounded-full"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6" />
                Start Over
              </Button>
            </div>
          )}
        </div>
        
        <footer className="mt-auto pt-8 pb-4 w-full text-center text-base md:text-lg xl:text-xl text-gray-500">
          <p>Pet Expo 2025 - LOOK LOOK Spin & Win</p>
          <p>One spin per visitor. Prizes subject to availability.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
