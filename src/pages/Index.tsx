
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
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-background to-secondary">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col min-h-screen">
        <ExpoHeader />
        
        <div className="w-full">
          <StepProgress currentStep={currentStep} steps={STEPS} />
          
          {!isEligible ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in">
              <h2 className="text-xl font-bold mb-4 text-destructive">Sorry!</h2>
              <p className="mb-4">
                You're not eligible to spin the wheel. This could be because:
              </p>
              <ul className="text-left mb-6 list-disc pl-6">
                <li>You've already used your spin</li>
                <li>You need to create a LOOK LOOK account</li>
                <li>Your QR code couldn't be verified</li>
              </ul>
              <Button onClick={handleReset} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {currentStep === 0 && <QrScanner onScanComplete={handleQrScanComplete} />}
              
              {currentStep === 1 && <SpinWheel onPrizeWon={handlePrizeWon} />}
              
              {currentStep === 2 && prize && <RewardClaim prize={prize} />}
            </>
          )}
          
          {(currentStep === 2 || !isEligible) && (
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Start Over
              </Button>
            </div>
          )}
        </div>
        
        <footer className="mt-auto pt-8 pb-4 w-full text-center text-sm text-muted-foreground">
          <p>Pet Expo 2025 - LOOK LOOK Spin & Win</p>
          <p>One spin per visitor. Prizes subject to availability.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
