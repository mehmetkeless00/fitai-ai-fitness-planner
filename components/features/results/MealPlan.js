'use client';

import { useState } from 'react';
import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function MealPlan({ plan }) {
  const [expandedDay, setExpandedDay] = useState(0);
  const [expandedAlternatives, setExpandedAlternatives] = useState({});
  const { t } = useLanguage();
  const s = t.mealPlan;
  const m = t.maps;

  if (!plan || !plan.mealPlan) {
    return <div className="text-center text-slate-400 py-8">{s.loading}</div>;
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
      return calories < 200 ? 'text-green-400' : calories < 300 ? 'text-yellow-400' : 'text-orange-400';
    }
    return calories < 400 ? 'text-red-400' : calories < 700 ? 'text-yellow-400' : 'text-orange-400';
  };

  const getDifficultyClasses = (difficulty) => {
    if (difficulty === 'Easy') return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
    if (difficulty === 'Medium') return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300';
  };

  return (
    <div className="space-y-4">
      {plan.mealPlan.map((dayPlan, dayIdx) => (
        <Card
          key={dayIdx}
          className="hover:border-sky-500/30 transition-all cursor-pointer"
          onClick={() => setExpandedDay(expandedDay === dayIdx ? -1 : dayIdx)}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              {m.days[dayPlan.day] || dayPlan.day}
            </h3>
            {expandedDay === dayIdx && <span className="text-xl text-sky-400">▲</span>}
            {expandedDay !== dayIdx && <span className="text-xl text-slate-400 dark:text-slate-500">▼</span>}
          </div>

          {expandedDay === dayIdx && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-dark-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dayPlan.meals && Object.entries(dayPlan.meals).map(([mealType, meal]) => (
                  <div
                    key={mealType}
                    className="bg-white dark:bg-dark-surface/50 border border-slate-200 dark:border-dark-border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-sky-600 dark:text-sky-400 font-semibold mb-1">
                          {getMealIcon(mealType)} {m.mealTypes[mealType] || mealType}
                        </p>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">{meal.name}</p>
                      </div>
                      {meal.calories && (
                        <span className={`text-lg font-bold ${getCalorieColor(meal.calories, mealType === 'snack')}`}>
                          {meal.calories}
                        </span>
                      )}
                    </div>

                    {meal.macros && (
                      <div className="bg-slate-100 dark:bg-dark-bg/50 rounded p-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">P</span>
                          <span className="font-medium text-red-600 dark:text-red-400">{meal.macros.protein}g</span>
                          <span className="text-slate-600 dark:text-slate-400">C</span>
                          <span className="font-medium text-yellow-600 dark:text-yellow-400">{meal.macros.carbs}g</span>
                          <span className="text-slate-600 dark:text-slate-400">F</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{meal.macros.fat}g</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1 overflow-hidden flex gap-0.5">
                          <div
                            className="bg-red-500"
                            style={{ width: `${(meal.macros.protein / (meal.macros.protein + meal.macros.carbs + meal.macros.fat)) * 100}%` }}
                          />
                          <div
                            className="bg-yellow-500"
                            style={{ width: `${(meal.macros.carbs / (meal.macros.protein + meal.macros.carbs + meal.macros.fat)) * 100}%` }}
                          />
                          <div
                            className="bg-green-500"
                            style={{ width: `${(meal.macros.fat / (meal.macros.protein + meal.macros.carbs + meal.macros.fat)) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-600 dark:text-slate-400">{meal.description}</p>

                    <div className="flex flex-wrap gap-1 text-xs">
                      {meal.timing && <span className="text-gray-600 dark:text-slate-400">⏰ {meal.timing}</span>}
                      {meal.prepTime && <span className="text-gray-600 dark:text-slate-400">⏱ {meal.prepTime}</span>}
                      {meal.difficulty && (
                        <span className={`px-1.5 py-0.5 rounded ${getDifficultyClasses(meal.difficulty)}`}>
                          {m.difficulty[meal.difficulty] || meal.difficulty}
                        </span>
                      )}
                    </div>

                    {meal.alternatives && meal.alternatives.length > 0 && (
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAlternatives(dayIdx, mealType);
                          }}
                          className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                        >
                          {expandedAlternatives[`${dayIdx}-${mealType}`] ? s.hideAlternatives : s.showAlternatives}
                        </button>
                        {expandedAlternatives[`${dayIdx}-${mealType}`] && (
                          <ul className="mt-1 space-y-1 ml-2 text-xs text-gray-600 dark:text-slate-400">
                            {meal.alternatives.map((alt, altIdx) => (
                              <li key={altIdx} className="flex items-start gap-2">
                                <span className="text-sky-600 dark:text-sky-400">•</span>
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
                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">{s.hydrationReminders}</h4>
                  <ul className="space-y-1">
                    {dayPlan.hydrationReminders.map((reminder, idx) => (
                      <li key={idx} className="text-sm text-gray-700 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
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
