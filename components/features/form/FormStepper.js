'use client';

import { useState } from 'react';
import Button from '../../ui/Button';

export default function FormStepper({ steps, onComplete, isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = (stepData) => {
    console.log('[FormStepper] Step data received:', stepData);
    const merged = { ...formData, ...stepData };
    console.log('[FormStepper] Merged data:', merged);
    setFormData(merged);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('[FormStepper] Final submission:', merged);
      onComplete(merged);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="w-full">
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                  ${idx <= currentStep ? 'bg-sky-500 text-white' : 'bg-dark-surface text-slate-400'}
                  transition-all`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full
                    ${idx < currentStep ? 'bg-sky-500' : 'bg-dark-border'}
                    transition-all`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-64">
        <StepComponent
          onNext={handleNext}
          formData={formData}
          isLastStep={currentStep === steps.length - 1}
        />
      </div>

      <div className="flex gap-4 mt-8">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentStep === 0 || isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </Button>
        <div className="flex-1" />
        <Button
          onClick={() => {
            const stepData = StepComponent.defaultProps?.initialData || {};
            handleNext(stepData);
          }}
          disabled={isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === steps.length - 1 ? 'Generate Plan' : 'Next →'}
        </Button>
      </div>
    </div>
  );
}
