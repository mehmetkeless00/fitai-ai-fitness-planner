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
    <div className="rounded-[20px] overflow-hidden border border-line shadow-[0_1px_2px_rgba(20,22,30,0.04),0_10px_26px_-18px_rgba(20,22,30,0.22)] grid md:grid-cols-[260px_1fr]">

      {/* LEFT DARK RAIL — desktop only */}
      <div className="hidden md:flex flex-col bg-ink-900 px-8 py-10">
        <div className="w-8 h-8 bg-accent rounded-[8px] mb-8 flex-shrink-0" />

        <div className="space-y-5 flex-1">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300
                  ${idx < currentStep
                    ? 'bg-accent text-[#062815]'
                    : idx === currentStep
                      ? 'border-2 border-accent text-accent bg-transparent'
                      : 'border-2 border-ink-700 text-ink-500 bg-transparent'
                  }`}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className={`text-sm transition-colors duration-300 ${idx === currentStep ? 'text-paper font-medium' : 'text-ink-500'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-ink-700">
          <p className="text-xs text-ink-500 leading-relaxed">{motivation.description}</p>
        </div>
      </div>

      {/* RIGHT WARM CANVAS */}
      <div className="bg-canvas dark:bg-dark-surface px-6 md:px-10 py-8">

        {/* Mobile-only: 3-segment strip */}
        <div className="flex gap-1.5 mb-6 md:hidden">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-accent' : 'bg-line'}`}
            />
          ))}
        </div>

        {/* Desktop: overline + progress bar */}
        <div className="hidden md:block mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400">
              {t.createPlan.stepOf} {currentStep + 1} {t.createPlan.of} {steps.length}
            </span>
            <span className="text-xs text-ink-300 dark:text-slate-500">{Math.round(stepProgress)}%</span>
          </div>
          <div className="h-1 bg-line dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Motivation heading */}
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-ink-900 dark:text-white mb-1">{motivation.title}</h3>
        </div>

        {/* Form content */}
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <StepComponent
            onNext={handleNext}
            formData={formData}
            isLoading={isLoading}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>

        {/* Back button */}
        {currentStep > 0 && (
          <div className="flex mt-8">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={isLoading || isTransitioning}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.createPlan.prev}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
