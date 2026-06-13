'use client';

import { useState } from 'react';
import Button from '../../ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function FormStepper({ steps, onComplete, isLoading }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage();

  const handleNext = (stepData) => {
    const merged = { ...formData, ...stepData };
    setFormData(merged);

    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete(merged);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const StepComponent = steps[currentStep].component;
  const motivation = t.createPlan.stepMotivation[currentStep] || {};
  const totalSteps = steps.length;
  const stepProgress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Progress section with motivation */}
      <div className="mb-10">
        {/* Step counter and progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
            {t.createPlan.stepOf} {currentStep + 1} {t.createPlan.of} {steps.length}
          </span>
          <span className="text-xs text-slate-500">{Math.round(stepProgress)}{t.createPlan.percentComplete}</span>
        </div>

        {/* Animated progress bar */}
        <div className="relative h-1.5 bg-slate-300 dark:bg-dark-border rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${stepProgress}%` }}
          />
        </div>

        {/* Step indicators with animation */}
        <div className="flex justify-between gap-2 mb-6 md:mb-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center font-semibold text-sm md:text-base transition-all duration-500 relative
                  ${
                    idx < currentStep
                      ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/40'
                      : idx === currentStep
                        ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white border border-sky-500 shadow-lg shadow-sky-500/40 scale-110'
                        : 'bg-slate-100 dark:bg-dark-surface text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-dark-border'
                  }
                `}
              >
                {idx < currentStep ? '✓' : idx + 1}
                {idx === currentStep && (
                  <span className="absolute inset-0 rounded-full bg-sky-500 animate-pulse opacity-20" />
                )}
              </div>
              <span
                className={`text-xs md:text-sm mt-1.5 md:mt-2 text-center leading-tight transition-colors
                  ${idx === currentStep ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Motivational copy */}
        <div className="bg-gradient-to-r from-sky-500/5 to-purple-500/5 border border-sky-500/20 rounded-lg p-3 md:p-4 step-motivation">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white mb-1">{motivation.title}</h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">{motivation.description}</p>
        </div>
      </div>

      {/* Form content with smooth transition */}
      <div className="min-h-80">
        <div
          className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <StepComponent
            onNext={handleNext}
            formData={formData}
            isLoading={isLoading}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>
      </div>

      {/* Navigation buttons — each step's own submit button advances the flow */}
      {currentStep > 0 && (
        <div className="flex mt-8 md:mt-10">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={isLoading || isTransitioning}
            className="disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 w-full sm:w-auto"
          >
            {t.createPlan.prev}
          </Button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .step-motivation {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
