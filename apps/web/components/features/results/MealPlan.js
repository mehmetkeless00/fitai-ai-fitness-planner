'use client';

import { useState } from 'react';
import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { getMealOptions } from '@fitflow/core';

export default function MealPlan({ plan, onPlanChange }) {
  const [expandedDay, setExpandedDay] = useState(0);
  const [expandedAlternatives, setExpandedAlternatives] = useState({});
  const { t, lang } = useLanguage();
  const s = t.mealPlan;
  const m = t.maps;

  const swapMeal = (dayIdx, mealType) => {
    if (!onPlanChange) return;
    const options = getMealOptions(plan.dietaryPreference, plan.allergies || '', lang)[mealType] || [];
    const current = plan.mealPlan[dayIdx].meals[mealType];
    const pool = options.filter((o) => o.name !== current.name);
    if (pool.length === 0) return;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    const next = JSON.parse(JSON.stringify(plan));
    next.mealPlan[dayIdx].meals[mealType] = {
      ...current,
      name: pick.name,
      description: pick.description,
      _srcIdx: pick._srcIdx,
      prepTime: pick.prepTime || current.prepTime,
      difficulty: pick.difficulty || 'Easy',
      alternatives: pick.alternatives || [],
    };
    onPlanChange(next);
  };

  if (!plan || !plan.mealPlan) {
    return <div className="text-center text-ink-500 dark:text-slate-400 py-8">{s.loading}</div>;
  }

  const toggleAlternatives = (dayIdx, mealType) => {
    const key = `${dayIdx}-${mealType}`;
    setExpandedAlternatives((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getMealIcon = (mealType) => {
    const icons = { breakfast: '🌅', lunch: '🥗', dinner: '🍽️', snack: '🥜' };
    return icons[mealType] || '🍴';
  };

  const getCalorieColor = (calories, isSnack = false) => {
    if (isSnack) {
      return calories < 200 ? 'text-accent' : calories < 300 ? 'text-[#F5A524]' : 'text-[#FF6B5E]';
    }
    return calories < 400 ? 'text-semantic-danger' : calories < 700 ? 'text-ink-700 dark:text-slate-200' : 'text-[#FF6B5E]';
  };

  const getDifficultyClasses = (difficulty) => {
    if (difficulty === 'Easy') return 'bg-accent-wash dark:bg-accent/10 text-accent-600 border border-accent/20';
    if (difficulty === 'Medium') return 'bg-[#FEF3E2] dark:bg-amber-900/30 text-[#9A6000] dark:text-amber-300 border border-[#F5A524]/20';
    return 'bg-[#FDECEA] dark:bg-red-900/30 text-semantic-danger border border-semantic-danger/20';
  };

  return (
    <div className="space-y-4">
      {plan.mealPlan.map((dayPlan, dayIdx) => (
        <Card
          key={dayIdx}
          className="hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all"
        >
          <button
            type="button"
            aria-expanded={expandedDay === dayIdx}
            aria-controls={`meal-day-${dayIdx}`}
            onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
            className="w-full flex justify-between items-center text-left bg-transparent rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <span className="text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
              <span aria-hidden="true">🥗</span>
              {m.days[dayPlan.day] || dayPlan.day}
            </span>
            <span
              className={`text-sm transition-transform duration-300 flex-shrink-0 ml-3 ${
                expandedDay === dayIdx ? 'rotate-180 text-accent' : 'text-ink-300 dark:text-slate-500'
              }`}
              aria-hidden="true"
            >
              ▼
            </span>
          </button>

          {expandedDay === dayIdx && (
            <div id={`meal-day-${dayIdx}`} className="space-y-4 mt-4 pt-4 border-t border-line dark:border-dark-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayPlan.meals && Object.entries(dayPlan.meals).map(([mealType, meal]) => (
                  <div
                    key={mealType}
                    className="bg-paper dark:bg-slate-700/40 border border-line dark:border-slate-600 rounded-[14px] p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-accent-600 mb-1">
                          {getMealIcon(mealType)} {m.mealTypes[mealType] || mealType}
                        </p>
                        <p className="font-semibold text-ink-900 dark:text-white text-sm leading-snug">{meal.name}</p>
                      </div>
                      {meal.calories && (
                        <span className={`text-lg font-bold tabular-nums flex-shrink-0 ${getCalorieColor(meal.calories, mealType === 'snack')}`}>
                          {meal.calories}
                        </span>
                      )}
                    </div>

                    {meal.macros && (
                      <div className="bg-canvas dark:bg-slate-700/60 rounded-[8px] p-2 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-ink-500 dark:text-slate-400 font-medium">P</span>
                          <span className="font-semibold text-[#14C06A] tabular-nums">{meal.macros.protein}g</span>
                          <span className="text-ink-500 dark:text-slate-400 font-medium">C</span>
                          <span className="font-semibold text-[#9A6000] dark:text-amber-300 tabular-nums">{meal.macros.carbs}g</span>
                          <span className="text-ink-500 dark:text-slate-400 font-medium">F</span>
                          <span className="font-semibold text-[#7C8CFF] tabular-nums">{meal.macros.fat}g</span>
                        </div>
                        <div className="w-full bg-line dark:bg-slate-600 rounded-full h-1 overflow-hidden flex gap-0.5">
                          <div
                            className="bg-[#14C06A]"
                            style={{ width: `${(meal.macros.protein / (meal.macros.protein + meal.macros.carbs + meal.macros.fat)) * 100}%` }}
                          />
                          <div
                            className="bg-[#F5A524]"
                            style={{ width: `${(meal.macros.carbs / (meal.macros.protein + meal.macros.carbs + meal.macros.fat)) * 100}%` }}
                          />
                          <div
                            className="bg-[#7C8CFF]"
                            style={{ width: `${(meal.macros.fat / (meal.macros.protein + meal.macros.carbs + meal.macros.fat)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-ink-500 dark:text-slate-400 leading-relaxed">{meal.description}</p>

                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {meal.timing && <span className="text-ink-500 dark:text-slate-400">⏰ {meal.timing}</span>}
                      {meal.prepTime && <span className="text-ink-500 dark:text-slate-400">⏱ {meal.prepTime}</span>}
                      {meal.difficulty && (
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${getDifficultyClasses(meal.difficulty)}`}>
                          {m.difficulty[meal.difficulty] || meal.difficulty}
                        </span>
                      )}
                    </div>

                    {onPlanChange && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          swapMeal(dayIdx, mealType);
                        }}
                        className="text-xs text-accent-600 hover:text-accent transition-colors font-medium"
                      >
                        🔄 {s.swap}
                      </button>
                    )}

                    {meal.alternatives && meal.alternatives.length > 0 && (
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAlternatives(dayIdx, mealType);
                          }}
                          className="text-xs text-accent-600 hover:text-accent transition-colors font-medium"
                        >
                          {expandedAlternatives[`${dayIdx}-${mealType}`] ? s.hideAlternatives : s.showAlternatives}
                        </button>
                        {expandedAlternatives[`${dayIdx}-${mealType}`] && (
                          <ul className="mt-1.5 space-y-1 ml-2 text-xs text-ink-500 dark:text-slate-400">
                            {meal.alternatives.map((alt, altIdx) => (
                              <li key={altIdx} className="flex items-start gap-2">
                                <span className="text-accent-600 flex-shrink-0">•</span>
                                <span>{alt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {dayPlan.hydrationReminders && dayPlan.hydrationReminders.length > 0 && (
                <div className="bg-canvas dark:bg-slate-700/40 border border-line dark:border-slate-600 rounded-[12px] p-3">
                  <h4 className="text-sm font-semibold text-[#21C7C7] mb-2">{s.hydrationReminders}</h4>
                  <ul className="space-y-1">
                    {dayPlan.hydrationReminders.map((reminder, idx) => (
                      <li key={idx} className="text-sm text-ink-700 dark:text-slate-200 flex items-start gap-2">
                        <span className="text-[#21C7C7] mt-0.5 flex-shrink-0">•</span>
                        <span>{m.hydrationReminders[reminder] || reminder}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
