
import React from 'react';
import { Check, PawPrint } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8 md:mb-12 xl:mb-16 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={`step-indicator flex items-center justify-center h-12 w-12 md:h-16 md:w-16 xl:h-24 xl:w-24 rounded-full text-white font-bold text-base md:text-lg xl:text-2xl ${
                  index < currentStep 
                    ? 'bg-expo-green' 
                    : index === currentStep 
                    ? 'bg-expo-purple' 
                    : 'bg-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-6 w-6 md:h-8 md:w-8 xl:h-12 xl:w-12" />
                ) : index === currentStep ? (
                  <PawPrint className="h-6 w-6 md:h-8 md:w-8 xl:h-12 xl:w-12" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-sm md:text-lg xl:text-2xl mt-2 md:mt-3 font-medium text-center max-w-[120px] md:max-w-[160px] xl:max-w-[200px] text-expo-purple">
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-2 md:h-3 xl:h-4 mx-2 md:mx-4 rounded-full ${
                  index < currentStep - 1 
                    ? 'bg-expo-green' 
                    : index === currentStep - 1 
                    ? 'bg-expo-purple' 
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
