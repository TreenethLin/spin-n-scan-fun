
import React, { useState } from 'react';
import ExpoHeader from '@/components/ExpoHeader';
import StepProgress from '@/components/StepProgress';
import QrScanner from '@/components/QrScanner';
import SpinWheel from '@/components/SpinWheel';
import RewardClaim from '@/components/RewardClaim';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl flex flex-col items-center min-h-screen justify-center">
        <ExpoHeader />
        
        <div className="w-full">
          <StepProgress currentStep={currentStep} steps={STEPS} />
          
          {!isEligible ? (
            <div className="bg-white p-6 md:p-8 xl:p-10 rounded-lg shadow-md text-center animate-fade-in max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl xl:text-3xl font-bold mb-4 md:mb-6 text-destructive">Sorry!</h2>
              <p className="mb-4 md:text-lg xl:text-xl">
                You're not eligible to spin the wheel. This could be because:
              </p>
              <ul className="text-left mb-6 list-disc pl-6 md:text-lg xl:text-xl">
                <li>You've already used your spin</li>
                <li>You need to create a LOOK LOOK account</li>
                <li>Your QR code couldn't be verified</li>
              </ul>
              <Button onClick={handleReset} size="lg" className="flex items-center gap-2 text-lg md:text-xl">
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6" />
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
                className="flex items-center gap-2 text-lg md:text-xl p-6 md:p-8"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 md:h-6 md:w-6" />
                Start Over
              </Button>
            </div>
          )}
        </div>
        
        <footer className="mt-auto pt-8 pb-4 w-full text-center text-base md:text-lg xl:text-xl text-muted-foreground">
          <p>Pet Expo 2025 - LOOK LOOK Spin & Win</p>
          <p>One spin per visitor. Prizes subject to availability.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
