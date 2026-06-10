'use client';

import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function NutritionSummary({ plan }) {
  const { t } = useLanguage();
  const s = t.nutritionSummary;
  const m = t.maps;

  if (!plan) {
    return <div className="text-center text-slate-400 py-8">{s.loading}</div>;
  }

  const stats = [
    { label: s.dailyCalories, value: `${plan.dailyCalories?.toLocaleString() || '2,500'}`, icon: '🔥' },
    { label: s.protein, value: `${plan.macros?.protein?.grams || 180}g`, icon: '💪' },
    { label: s.carbs, value: `${plan.macros?.carbs?.grams || 300}g`, icon: '⚡' },
    { label: s.fat, value: `${plan.macros?.fat?.grams || 85}g`, icon: '🥑' },
  ];

  const getRecoveryScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
    if (score >= 60) return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };
  };

  const recoveryColor = getRecoveryScoreColor(plan.recoveryScore || 75);

  const translateHydration = (hydration) => {
    if (!hydration) return hydration;
    const enSuffix = 'liters per day (more on workout days)';
    if (hydration.endsWith(enSuffix)) {
      return hydration.replace(enSuffix, m.hydrationSuffix);
    }
    return hydration;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="text-center p-3 md:p-4 hover:border-sky-500/30">
            <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mb-2 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/15 text-xl md:text-2xl">
              {stat.icon}
            </div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
            <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {plan.macros && (
        <Card className="mt-4">
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3">{s.macroBreakdown}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-slate-900 dark:text-white">{s.protein}</span>
              <span className="text-sm md:text-base text-red-600 dark:text-red-400 font-semibold">{plan.macros.protein?.percentage || 28}%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 h-full" style={{ width: `${plan.macros.protein?.percentage || 28}%` }} />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs md:text-sm text-slate-900 dark:text-white">{s.carbs}</span>
              <span className="text-sm md:text-base text-yellow-600 dark:text-yellow-400 font-semibold">{plan.macros.carbs?.percentage || 48}%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full" style={{ width: `${plan.macros.carbs?.percentage || 48}%` }} />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs md:text-sm text-slate-900 dark:text-white">{s.fat}</span>
              <span className="text-sm md:text-base text-green-600 dark:text-green-400 font-semibold">{plan.macros.fat?.percentage || 24}%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full" style={{ width: `${plan.macros.fat?.percentage || 24}%` }} />
            </div>
          </div>
        </Card>
      )}

      {plan.hydration && (
        <Card className="mt-4">
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-2">{s.hydrationGoal}</p>
            <p className="text-lg md:text-xl font-semibold text-sky-600 dark:text-sky-400">
              {translateHydration(plan.hydration)}
            </p>
          </div>
        </Card>
      )}

      {plan.recoveryScore !== undefined && (
        <Card className={`mt-4 ${recoveryColor.bg} border ${recoveryColor.border}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-sm md:text-base ${recoveryColor.text}`}>{s.recoveryScore}</h3>
            <span className={`text-2xl md:text-3xl font-bold ${recoveryColor.text}`}>{Math.round(plan.recoveryScore)}</span>
          </div>
          <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${recoveryColor.text.replace('text-', 'bg-')}`}
              style={{ width: `${plan.recoveryScore}%` }}
            />
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2">
            {plan.recoveryScore >= 80 ? s.recoveryGreat : plan.recoveryScore >= 60 ? s.recoveryGood : s.recoveryLow}
          </p>
        </Card>
      )}

      {plan.dailyHabitTips && plan.dailyHabitTips.length > 0 && (
        <Card className="mt-4 bg-gradient-to-r from-purple-50 dark:from-purple-500/10 to-blue-50 dark:to-blue-500/10 border-purple-200 dark:border-purple-500/20">
          <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-3">{s.dailyHabitTips}</h3>
          <ul className="space-y-2">
            {plan.dailyHabitTips.map((tip, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-400 text-sm flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                <span>{m.habitTips[tip] || tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan.riskFlags && plan.riskFlags.length > 0 && (
        <Card className="mt-4 bg-gradient-to-r from-orange-50 dark:from-orange-500/10 to-red-50 dark:to-red-500/10 border-orange-200 dark:border-orange-500/20">
          <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-3">{s.importantNotes}</h3>
          <ul className="space-y-2">
            {plan.riskFlags.map((flag, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-400 text-sm flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                <span>{m.riskFlags[flag] || flag}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan.groceryList && Object.keys(plan.groceryList).length > 0 && (
        <Card className="mt-4">
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3">{s.shoppingList}</h3>
          <div className="space-y-3">
            {Object.entries(plan.groceryList).map(([category, items]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
                  {m.groceryCategories[category] || category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 5).map((item, idx) => (
                    <span key={idx} className="text-xs bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                  {items.length > 5 && (
                    <span className="text-xs text-gray-600 dark:text-slate-400 px-2 py-1">+{items.length - 5} {s.more}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-3">{s.shoppingTip}</p>
        </Card>
      )}
    </div>
  );
}
