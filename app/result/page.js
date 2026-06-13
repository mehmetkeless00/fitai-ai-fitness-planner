'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import NutritionSummary from '@/components/features/results/NutritionSummary';
import WorkoutPlan from '@/components/features/results/WorkoutPlan';
import MealPlan from '@/components/features/results/MealPlan';
import ProgressTracker from '@/components/features/results/ProgressTracker';
import { generatePlanPDF } from '@/utils/pdf-generator';
import { getActivePlan, updatePlanData } from '@/utils/planStorage';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Result() {
  const [planData, setPlanData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const tabListRef = useRef(null);
  const { t, lang } = useLanguage();
  const r = t.result;

  const getGoalLabel = (goalValue) => {
    return t.createPlan.goals.goalOptions.find((g) => g.value === goalValue)?.label || goalValue?.replace(/-/g, ' ');
  };

  const [planId, setPlanId] = useState(null);

  useEffect(() => {
    const entry = getActivePlan();
    if (entry) {
      setPlanData(entry.data);
      setPlanId(entry.id);
    }
  }, []);

  const handlePlanChange = (next) => {
    setPlanData(next);
    if (planId) {
      updatePlanData(planId, next);
    }
  };

  const handleDownloadPDF = async () => {
    if (!planData) return;

    setIsDownloading(true);
    setPdfError(false);
    try {
      await generatePlanPDF(planData, lang);
      track('pdf_downloaded', { lang });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setPdfError(true);
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
    { key: 'progress', label: r.tabs.progress },
    { key: 'advice', label: r.tabs.advice },
  ];

  const handleTabKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const idx = tabs.findIndex((tab) => tab.key === activeTab);
    const next =
      e.key === 'ArrowRight' ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[next].key);
    tabListRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

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

          <div className="flex justify-center mb-8 overflow-x-auto pb-2 px-2">
            <div
              role="tablist"
              ref={tabListRef}
              onKeyDown={handleTabKeyDown}
              className="inline-flex gap-1 p-1 bg-slate-100 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl"
            >
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  tabIndex={activeTab === key ? 0 : -1}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 sm:px-5 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500
                    ${
                      activeTab === key
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-dark-bg/40'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
              <WorkoutPlan plan={planData} onPlanChange={handlePlanChange} />
            </div>
          )}

          {activeTab === 'meals' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.mealHeading}</h2>
              <MealPlan plan={planData} onPlanChange={handlePlanChange} />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t.progress.heading}</h2>
              <ProgressTracker plan={planData} onPlanChange={handlePlanChange} />
            </div>
          )}

          {activeTab === 'advice' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{r.coachHeading}</h2>
              <Card className="bg-gradient-to-br from-sky-50 via-white dark:via-transparent to-blue-50 dark:from-sky-500/10 dark:to-blue-500/10 border-sky-200 dark:border-sky-500/20">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/30">
                    🎯
                  </div>
                  <blockquote className="relative text-center md:text-left">
                    <span
                      className="hidden md:block absolute -left-3 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-sky-500 to-blue-600"
                      aria-hidden="true"
                    />
                    <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed md:pl-3">
                      {planData.advice || r.defaultAdvice}
                    </p>
                  </blockquote>
                </div>
              </Card>
            </div>
          )}

          {pdfError && (
            <div
              role="alert"
              className="max-w-xl mx-auto mt-8 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg text-center"
            >
              <p className="text-sm text-red-700 dark:text-red-400">{r.pdfError}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 md:mt-12 px-2">
            <Link href="/plans" className="w-full sm:w-auto">
              <Button variant="outline" disabled={isDownloading} className="w-full">
                {t.nav.myPlans}
              </Button>
            </Link>
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
