'use client';

import { useState, useEffect } from 'react';

const LOADING_STAGES = [
  { stage: 'Analyzing your fitness goals', icon: '🎯' },
  { stage: 'Calculating your nutrition needs', icon: '🥗' },
  { stage: 'Creating workout routine', icon: '💪' },
  { stage: 'Optimizing your plan', icon: '⚡' },
  { stage: 'Finalizing recommendations', icon: '✨' },
];

const AI_TIPS = [
  '💡 AI adapts your plan as you progress',
  '🏋️ Progressive overload is key to growth',
  '🥤 Stay hydrated for optimal performance',
  '😴 Recovery is when your muscles grow',
  '🎯 Consistency beats intensity',
  '🧠 Mind-muscle connection matters',
  '⏱️ Rest periods affect your gains',
  '🔄 Periodization prevents plateaus',
];

export default function PremiumLoadingScreen() {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 1200);
    return () => clearInterval(stageInterval);
  }, []);

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % AI_TIPS.length);
    }, 4000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 15;
      });
    }, 800);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-slate-50 dark:from-dark-bg dark:via-dark-surface to-slate-100 dark:to-dark-bg flex items-center justify-center z-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-md w-full mx-4">
        {/* Logo and title */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">FitFlow Coach</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Building your personalized plan</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="relative h-1 bg-slate-300 dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 text-center">{Math.round(progress)}%</p>
        </div>

        {/* Current stage with icon and text */}
        <div className="mb-8 text-center">
          <div className="inline-block mb-3">
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>
              {LOADING_STAGES[currentStage].icon}
            </div>
          </div>
          <div className="relative h-12 flex items-center justify-center">
            <p key={currentStage} className="text-slate-900 dark:text-white font-medium text-sm animate-fade-in">
              {LOADING_STAGES[currentStage].stage}
            </p>
          </div>
        </div>

        {/* AI Tips carousel */}
        <div className="bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-lg p-4 mb-6">
          <div className="relative h-16 flex items-center">
            <p key={currentTip} className="text-slate-700 dark:text-slate-300 text-sm animate-fade-in">
              {AI_TIPS[currentTip]}
            </p>
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex gap-1 justify-center">
          {LOADING_STAGES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx <= currentStage ? 'bg-sky-500 w-4' : 'bg-slate-300 dark:bg-dark-border w-1.5'
              }`}
            />
          ))}
        </div>

        {/* Animated dots */}
        <div className="flex gap-1 justify-center mt-6">
          <span className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" />
          <span
            className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          <span
            className="w-2 h-2 bg-sky-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        :global(.animate-fade-in) {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
