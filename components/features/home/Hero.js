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
    <div className="text-center py-20 md:py-32">
      <div className="inline-block mb-4 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-full">
        <p className="text-sky-400 text-sm font-medium">🎯 AI-Powered Fitness Planning</p>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Your Personal AI
        <br />
        <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Fitness Coach
        </span>
      </h1>

      <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
        Get AI-generated personalized workout and meal plans tailored to your goals, experience level, and preferences.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

