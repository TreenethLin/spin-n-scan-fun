
import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8 md:mb-12 xl:mb-16 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={`step-indicator flex items-center justify-center h-10 w-10 md:h-14 md:w-14 xl:h-20 xl:w-20 rounded-full text-white font-bold text-sm md:text-base xl:text-xl ${
                  index < currentStep 
                    ? 'bg-expo-green' 
                    : index === currentStep 
                    ? 'bg-expo-purple' 
                    : 'bg-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-5 w-5 md:h-7 md:w-7 xl:h-10 xl:w-10" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-sm md:text-lg xl:text-2xl mt-2 md:mt-3 font-medium text-center max-w-[120px] md:max-w-[160px] xl:max-w-[200px]">
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-1 md:h-2 xl:h-3 mx-2 md:mx-4 ${
                  index < currentStep - 1 
                    ? 'bg-expo-green' 
                    : index === currentStep - 1 
                    ? 'bg-expo-purple' 
                    : 'bg-muted'
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
