'use client';

import { useEffect, useState } from 'react';
import Card from '../../ui/Card';
import EnergyRing from '../../ui/EnergyRing';
import MacroBar from '../../ui/MacroBar';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { blendRecoveryScore, listCheckins } from '@fitflow/core';

export default function NutritionSummary({ plan }) {
  const { t } = useLanguage();
  const s = t.nutritionSummary;
  const m = t.maps;

  const [checkins, setCheckins] = useState([]);
  useEffect(() => {
    setCheckins(listCheckins());
  }, []);

  const recoveryScore =
    plan?.recoveryScore !== undefined
      ? blendRecoveryScore(plan.recoveryScore, checkins, plan.workoutPlan)
      : undefined;

  if (!plan) {
    return <div className="text-center text-ink-500 dark:text-slate-400 py-8">{s.loading}</div>;
  }

  const totalGrams =
    (plan.macros?.protein?.grams || 0) +
    (plan.macros?.carbs?.grams || 0) +
    (plan.macros?.fat?.grams || 0);

  const getRecoveryColor = (score) => {
    if (score >= 80) return { card: 'bg-accent-wash dark:bg-accent/10 border-accent/20', text: 'text-accent', bar: 'bg-accent' };
    if (score >= 60) return { card: 'bg-[#FEF3E2] dark:bg-amber-900/20 border-[#F5A524]/20', text: 'text-[#9A6000] dark:text-amber-300', bar: 'bg-[#F5A524]' };
    return { card: 'bg-[#FDECEA] dark:bg-red-900/20 border-semantic-danger/20', text: 'text-semantic-danger', bar: 'bg-semantic-danger' };
  };

  const translateHydration = (hydration) => {
    if (!hydration) return hydration;
    const enSuffix = 'liters per day (more on workout days)';
    if (hydration.endsWith(enSuffix)) {
      return hydration.replace(enSuffix, m.hydrationSuffix);
    }
    return hydration;
  };

  const recoveryColor = getRecoveryColor(recoveryScore ?? 75);

  return (
    <div className="space-y-4">
      {/* Hero card: EnergyRing + MacroBar rows */}
      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col items-center justify-center gap-3 p-6 sm:border-r border-line dark:border-dark-border">
            <EnergyRing
              energyProgress={Math.min((plan.dailyCalories || 2000) / 3000, 1)}
              proteinProgress={(plan.macros?.protein?.percentage || 28) / 100}
              size={152}
            >
              <span className="text-[22px] font-bold text-ink-900 dark:text-white tabular-nums leading-none">
                {(plan.dailyCalories || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-ink-500 dark:text-slate-400 uppercase tracking-[0.1em]">kcal</span>
            </EnergyRing>
            <div className="flex gap-4 text-xs text-ink-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B5E] flex-shrink-0" />
                {s.dailyCalories}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#14C06A] flex-shrink-0" />
                {s.protein}
              </span>
            </div>
          </div>

          {plan.macros && (
            <div className="flex-1 p-6 space-y-4 flex flex-col justify-center">
              <MacroBar
                label={s.protein}
                value={plan.macros.protein?.grams || 0}
                max={totalGrams || 1}
                type="protein"
              />
              <MacroBar
                label={s.carbs}
                value={plan.macros.carbs?.grams || 0}
                max={totalGrams || 1}
                type="carbs"
              />
              <MacroBar
                label={s.fat}
                value={plan.macros.fat?.grams || 0}
                max={totalGrams || 1}
                type="fat"
              />
            </div>
          )}
        </div>
      </Card>

      {plan.hydration && (
        <Card>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 dark:text-slate-400 mb-2">
            {s.hydrationGoal}
          </p>
          <p className="text-lg font-semibold text-[#21C7C7]">
            {translateHydration(plan.hydration)}
          </p>
        </Card>
      )}

      {recoveryScore !== undefined && (
        <Card className={`${recoveryColor.card} border`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-sm ${recoveryColor.text}`}>{s.recoveryScore}</h3>
            <span className={`text-2xl font-bold tabular-nums ${recoveryColor.text}`}>
              {Math.round(recoveryScore)}
            </span>
          </div>
          <div className="w-full bg-line dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full ${recoveryColor.bar} rounded-full transition-all duration-500`}
              style={{ width: `${recoveryScore}%` }}
            />
          </div>
          <p className={`text-xs mt-2 ${recoveryColor.text} opacity-80`}>
            {recoveryScore >= 80 ? s.recoveryGreat : recoveryScore >= 60 ? s.recoveryGood : s.recoveryLow}
          </p>
        </Card>
      )}

      {plan.dailyHabitTips && plan.dailyHabitTips.length > 0 && (
        <Card>
          <h3 className="font-semibold text-ink-700 dark:text-slate-200 mb-3">{s.dailyHabitTips}</h3>
          <ul className="space-y-2">
            {plan.dailyHabitTips.map((tip, idx) => (
              <li key={idx} className="text-sm text-ink-700 dark:text-slate-200 flex items-start gap-2">
                <span className="text-accent mt-0.5 flex-shrink-0">•</span>
                <span>{m.habitTips[tip] || tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan.riskFlags && plan.riskFlags.length > 0 && (
        <Card className="bg-[#FDECEA] dark:bg-red-900/20 border-semantic-danger/20">
          <h3 className="font-semibold text-semantic-danger mb-3">{s.importantNotes}</h3>
          <ul className="space-y-2">
            {plan.riskFlags.map((flag, idx) => (
              <li key={idx} className="text-sm text-ink-700 dark:text-slate-200 flex items-start gap-2">
                <span className="text-semantic-danger mt-0.5 flex-shrink-0">•</span>
                <span>{m.riskFlags[flag] || flag}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan.groceryList && Object.keys(plan.groceryList).length > 0 && (
        <Card>
          <h3 className="font-semibold text-accent-600 mb-3">{s.shoppingList}</h3>
          <div className="space-y-3">
            {Object.entries(plan.groceryList).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-accent-600 mb-1.5">
                  {m.groceryCategories[category] || category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 5).map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-accent-wash dark:bg-accent/10 text-accent-600 border border-accent/20 px-2 py-1 rounded-[6px]"
                    >
                      {item}
                    </span>
                  ))}
                  {items.length > 5 && (
                    <span className="text-xs text-ink-500 dark:text-slate-400 px-2 py-1">
                      +{items.length - 5} {s.more}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-500 dark:text-slate-400 mt-3">{s.shoppingTip}</p>
        </Card>
      )}
    </div>
  );
}
