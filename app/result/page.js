'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NutritionSummary from '@/components/features/results/NutritionSummary';
import WorkoutPlan from '@/components/features/results/WorkoutPlan';
import MealPlan from '@/components/features/results/MealPlan';
import { generatePlanPDF } from '@/utils/pdf-generator';

export default function Result() {
  const [planData, setPlanData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('userPlan');
    if (stored) {
      setPlanData(JSON.parse(stored));
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!planData) return;

    setIsDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      generatePlanPDF(planData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!planData) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 pb-20">
          <Container>
            <PageHeader
              title="No Plan Found"
              description="Please create a plan first"
            />
            <div className="text-center">
              <Link href="/create-plan">
                <Button size="lg">Create Plan</Button>
              </Link>
            </div>
          </Container>
        </main>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20">
        <Container>
          <PageHeader
            title="Your Personalized Plan"
            description={`Generated for ${planData.age} year old - ${planData.fitnessGoal?.replace(/-/g, ' ')}`}
          />

          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-400 text-sm">
              ⚠️ <span className="font-semibold">Disclaimer:</span> This plan is educational and based on fitness science principles. It is not medical advice. Consult a healthcare provider before starting any fitness program.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {['overview', 'workout', 'meals', 'advice'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all capitalize
                  ${
                    activeTab === tab
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-surface/80 dark:hover:text-white'
                  }`}
              >
                {tab === 'advice' ? '💡 Coach Advice' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">📊 Nutrition Overview</h2>
                <NutritionSummary plan={planData} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Profile</h2>
                <Card>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Age</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{planData.age}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Height</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{planData.height}cm</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Weight</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{planData.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">Goal</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white capitalize">
                        {planData.fitnessGoal?.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'workout' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">💪 Workout Plan</h2>
              <WorkoutPlan plan={planData} />
            </div>
          )}

          {activeTab === 'meals' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">🥗 Meal Plan</h2>
              <MealPlan plan={planData} />
            </div>
          )}

          {activeTab === 'advice' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">💡 AI Coach Advice</h2>
              <Card className="bg-gradient-to-r from-sky-50 dark:from-sky-500/10 to-blue-50 dark:to-blue-500/10 border-sky-200 dark:border-sky-500/20">
                <div className="text-center md:text-left">
                  <div className="text-5xl mb-4 text-center">🎯</div>
                  <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                    {planData.advice || 'Your personalized coaching advice will appear here.'}
                  </p>
                </div>
              </Card>
            </div>
          )}

          <div className="flex gap-4 justify-center mt-12">
            <Link href="/create-plan">
              <Button variant="secondary" disabled={isDownloading}>
                Create New Plan
              </Button>
            </Link>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={isDownloading ? 'opacity-75 cursor-not-allowed' : ''}
            >
              {isDownloading ? '⏳ Generating...' : '📥 Download PDF'}
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
