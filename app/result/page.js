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
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Result() {
  const [planData, setPlanData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useLanguage();
  const r = t.result;

  const getGoalLabel = (goalValue) => {
    return t.createPlan.goals.goalOptions.find((g) => g.value === goalValue)?.label || goalValue?.replace(/-/g, ' ');
  };

  useEffect(() => {
    const stored = localStorage.getItem('userPlan');
    if (stored) {
      try {
        setPlanData(JSON.parse(stored));
      } catch {
        localStorage.removeItem('userPlan');
      }
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
        <main className="min-h-screen pt-20 pb-12 md:pb-20">
          <Container>
            <PageHeader title={r.noPlanTitle} description={r.noPlanDesc} />
            <div className="text-center">
              <Link href="/create-plan">
                <Button size="lg">{r.createPlanBtn}</Button>
              </Link>
            </div>
          </Container>
        </main>
      </>
    );
  }

  const tabs = [
    { key: 'overview', label: r.tabs.overview },
    { key: 'workout', label: r.tabs.workout },
    { key: 'meals', label: r.tabs.meals },
    { key: 'advice', label: r.tabs.advice },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-20">
        <Container>
          <PageHeader
            title={r.pageTitle}
            description={r.headerDesc
              .replace('{age}', planData.age)
              .replace('{goal}', getGoalLabel(planData.fitnessGoal))}
          />

          <div className="max-w-2xl mx-auto mb-8 p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-400 text-sm">
              ⚠️ <span className="font-semibold">{r.disclaimerLabel}:</span> {r.disclaimer}
            </p>
          </div>

          <div className="flex gap-2 justify-center mb-8 overflow-x-auto pb-2 px-2">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base
                  ${
                    activeTab === key
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 dark:bg-dark-surface text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-surface/80 dark:hover:text-white'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.nutritionHeading}</h2>
                <NutritionSummary plan={planData} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.profileHeading}</h2>
                <Card>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{r.profile.age}</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{planData.age}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{r.profile.height}</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{planData.height}cm</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{r.profile.weight}</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white">{planData.weight}kg</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{r.profile.goal}</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white capitalize">
                        {getGoalLabel(planData.fitnessGoal)}
                      </p>
                    </div>
                  </div>
                  {planData.notes && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border text-left">
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{r.profile.notes}</p>
                      <p className="text-slate-900 dark:text-white text-sm mt-1">{planData.notes}</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'workout' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.workoutHeading}</h2>
              <WorkoutPlan plan={planData} />
            </div>
          )}

          {activeTab === 'meals' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.mealHeading}</h2>
              <MealPlan plan={planData} />
            </div>
          )}

          {activeTab === 'advice' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.coachHeading}</h2>
              <Card className="bg-gradient-to-r from-sky-50 dark:from-sky-500/10 to-blue-50 dark:to-blue-500/10 border-sky-200 dark:border-sky-500/20">
                <div className="text-center md:text-left">
                  <div className="text-5xl mb-4 text-center">🎯</div>
                  <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                    {planData.advice || r.defaultAdvice}
                  </p>
                </div>
              </Card>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 md:mt-12 px-2">
            <Link href="/create-plan" className="w-full sm:w-auto">
              <Button variant="secondary" disabled={isDownloading} className="w-full">
                {r.createNewPlan}
              </Button>
            </Link>
            <Button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`w-full sm:w-auto ${isDownloading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isDownloading ? r.generatingPDF : r.downloadPDF}
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
