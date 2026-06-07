'use client';

import Link from 'next/link';
import Button from '../../ui/Button';

export default function Hero() {
  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="text-center py-12 md:py-32">
      <div className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500/10 border border-sky-500/20 rounded-full">
        <p className="text-sky-400 text-xs sm:text-sm font-medium">🎯 AI-Powered Fitness Planning</p>
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2">
        Your Personal AI
        <br />
        <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Fitness Coach
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-3">
        Get AI-generated personalized workout and meal plans tailored to your goals, experience level, and preferences.
      </p>

      <div className="flex flex-col gap-3 sm:gap-4 justify-center px-3">
        <Link href="/create-plan">
          <Button size="lg">Start Creating Your Plan →</Button>
        </Link>
        <Button variant="secondary" size="lg" onClick={handleLearnMore}>
          Learn More
        </Button>
      </div>
    </div>
  );
}

