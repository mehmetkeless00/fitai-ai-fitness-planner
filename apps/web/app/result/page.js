'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
import { getActivePlan, updatePlanData, translateMealPlan } from '@fitflow/core';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Result() {
  const [planData, setPlanData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const tabListRef = useRef(null);
  const { t, lang } = useLanguage();
  const r = t.result;
  const wt = t.workoutPlan;
  const m = t.maps;

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

  // displayPlan is the plan translated to the current UI language for rendering.
  // planData in state always holds the authoritative stored version.
  const displayPlan = useMemo(() => translateMealPlan(planData, lang), [planData, lang]);

  const handlePlanChange = (next) => {
    // Keep lang consistent with content so round-trip re-translation works correctly.
    const normalized = { ...next, lang };
    setPlanData(normalized);
    if (planId) {
      updatePlanData(planId, normalized);
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
        <main id="main-content" className="min-h-screen pt-20 pb-12 md:pb-20">
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

  // Today's workout card — find matching day without new i18n keys
  const todayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const todayWorkout = displayPlan?.workoutPlan?.find(
    (d) => d.day === todayName && d.exercises?.length > 0
  );

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen pt-20 pb-20">
        <Container>
          <PageHeader
            title={r.pageTitle}
            description={r.headerDesc
              .replace('{age}', planData.age)
              .replace('{goal}', getGoalLabel(planData.fitnessGoal))}
          />

          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-[#FEF3E2] dark:bg-amber-900/20 border border-[#F5A524]/30 rounded-[14px]">
            <p className="text-[#9A6000] dark:text-amber-300 text-sm">
              <span className="font-semibold">{r.disclaimerLabel}:</span> {r.disclaimer}
            </p>
          </div>

          {/* Tab bar */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2 px-2">
            <div
              role="tablist"
              ref={tabListRef}
              onKeyDown={handleTabKeyDown}
              className="inline-flex gap-1 p-1 bg-canvas dark:bg-slate-800 border border-line dark:border-dark-border rounded-[14px]"
            >
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={activeTab === key}
                  tabIndex={activeTab === key ? 0 : -1}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 sm:px-5 py-2 rounded-[10px] font-medium transition-all whitespace-nowrap text-sm sm:text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1
                    ${activeTab === key
                      ? 'bg-ink-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'text-ink-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white hover:bg-paper dark:hover:bg-slate-700'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Nutrition heading + EnergyRing hero */}
              <div>
                <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">{r.nutritionHeading}</h2>
                <NutritionSummary plan={displayPlan} />
              </div>

              {/* Today's workout summary (uses existing i18n keys) */}
              {todayWorkout && (
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-1">
                        {r.tabs.workout}
                      </p>
                      <h3 className="text-base font-bold text-ink-900 dark:text-white">
                        {m.days[todayWorkout.day] || todayWorkout.day}
                        {todayWorkout.focus && (
                          <span className="ml-2 text-sm font-normal text-ink-500 dark:text-slate-400">
                            · {m.workoutFocus[todayWorkout.focus] || todayWorkout.focus}
                          </span>
                        )}
                      </h3>
                      {todayWorkout.totalEstimatedTime && (
                        <p className="text-xs text-ink-500 dark:text-slate-400 mt-0.5">
                          {todayWorkout.totalEstimatedTime} {wt.mins} · {todayWorkout.exercises?.length} {wt.exercises}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setActiveTab('workout')}
                      className="flex-shrink-0 text-xs font-semibold text-accent-600 hover:text-accent border border-accent/30 hover:border-accent px-3 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {r.tabs.workout} →
                    </button>
                  </div>
                </Card>
              )}

              {/* Profile card */}
              <div>
                <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">{r.profileHeading}</h2>
                <Card>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-1">
                        {r.profile.age}
                      </p>
                      <p className="text-xl font-bold text-ink-900 dark:text-white tabular-nums">{planData.age}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-1">
                        {r.profile.height}
                      </p>
                      <p className="text-xl font-bold text-ink-900 dark:text-white tabular-nums">
                        {planData.height}
                        <span className="text-sm font-normal text-ink-500 dark:text-slate-400">cm</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-1">
                        {r.profile.weight}
                      </p>
                      <p className="text-xl font-bold text-ink-900 dark:text-white tabular-nums">
                        {planData.weight}
                        <span className="text-sm font-normal text-ink-500 dark:text-slate-400">kg</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-1">
                        {r.profile.goal}
                      </p>
                      <p className="text-base font-bold text-ink-900 dark:text-white capitalize">
                        {getGoalLabel(planData.fitnessGoal)}
                      </p>
                    </div>
                  </div>
                  {planData.notes && (
                    <div className="mt-4 pt-4 border-t border-line dark:border-dark-border text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-1">
                        {r.profile.notes}
                      </p>
                      <p className="text-sm text-ink-700 dark:text-slate-200">{planData.notes}</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'workout' && (
            <div>
              <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">{r.workoutHeading}</h2>
              <WorkoutPlan plan={planData} onPlanChange={handlePlanChange} />
            </div>
          )}

          {activeTab === 'meals' && (
            <div>
              <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">{r.mealHeading}</h2>
              <MealPlan plan={displayPlan} onPlanChange={handlePlanChange} />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">{t.progress.heading}</h2>
              <ProgressTracker plan={planData} onPlanChange={handlePlanChange} />
            </div>
          )}

          {activeTab === 'advice' && (
            <div>
              <h2 className="text-xl font-bold text-ink-900 dark:text-white mb-4">{r.coachHeading}</h2>
              <Card>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-[14px] bg-accent flex items-center justify-center text-2xl shadow-[0_4px_12px_-4px_rgba(20,192,106,0.5)]">
                    🎯
                  </div>
                  <blockquote className="relative text-center md:text-left flex-1">
                    <span
                      className="hidden md:block absolute -left-3 top-0 bottom-0 w-0.5 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <p className="text-base text-ink-700 dark:text-slate-200 leading-relaxed md:pl-3">
                      {displayPlan?.advice || r.defaultAdvice}
                    </p>
                  </blockquote>
                </div>
              </Card>
            </div>
          )}

          {pdfError && (
            <div
              role="alert"
              className="max-w-xl mx-auto mt-8 p-3 bg-[#FDECEA] dark:bg-red-900/20 border border-semantic-danger/30 rounded-[14px] text-center"
            >
              <p className="text-sm text-semantic-danger">{r.pdfError}</p>
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
