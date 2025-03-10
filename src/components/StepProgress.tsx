
import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div 
                className={`step-indicator ${
                  index < currentStep 
                    ? 'completed' 
                    : index === currentStep 
                    ? 'active' 
                    : 'upcoming'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs md:text-sm mt-1 font-medium text-center">
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`step-connector ${
                  index < currentStep - 1 
                    ? 'completed' 
                    : index === currentStep - 1 
                    ? 'active' 
                    : 'upcoming'
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
