'use client';

import Card from '../../ui/Card';

export default function NutritionSummary({ plan }) {
  if (!plan) {
    return <div className="text-center text-slate-400 py-8">Loading nutrition data...</div>;
  }

  const stats = [
    {
      label: 'Daily Calories',
      value: `${plan.dailyCalories?.toLocaleString() || '2,500'}`,
      icon: '🔥',
    },
    {
      label: 'Protein',
      value: `${plan.macros?.protein?.grams || 180}g`,
      icon: '💪',
    },
    {
      label: 'Carbs',
      value: `${plan.macros?.carbs?.grams || 300}g`,
      icon: '⚡',
    },
    {
      label: 'Fat',
      value: `${plan.macros?.fat?.grams || 85}g`,
      icon: '🥑',
    },
  ];

  const getRecoveryScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' };
    if (score >= 60) return { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' };
    return { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' };
  };

  const recoveryColor = getRecoveryScoreColor(plan.recoveryScore || 75);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="text-center p-3 md:p-4">
            <div className="text-2xl md:text-3xl mb-2">{stat.icon}</div>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
            <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </Card>
        ))}
      </div>

      {plan.macros && (
        <Card className="mt-4">
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-3">Macronutrient Breakdown</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm text-slate-900 dark:text-white">Protein</span>
              <span className="text-sm md:text-base text-red-600 dark:text-red-400 font-semibold">{plan.macros.protein?.percentage || 28}%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-pink-500 h-full"
                style={{ width: `${plan.macros.protein?.percentage || 28}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs md:text-sm text-slate-900 dark:text-white">Carbs</span>
              <span className="text-sm md:text-base text-yellow-600 dark:text-yellow-400 font-semibold">{plan.macros.carbs?.percentage || 48}%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full"
                style={{ width: `${plan.macros.carbs?.percentage || 48}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-xs md:text-sm text-slate-900 dark:text-white">Fat</span>
              <span className="text-sm md:text-base text-green-600 dark:text-green-400 font-semibold">{plan.macros.fat?.percentage || 24}%</span>
            </div>
            <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                style={{ width: `${plan.macros.fat?.percentage || 24}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {plan.hydration && (
        <Card className="mt-4">
          <div className="text-center">
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mb-2">Daily Hydration Goal</p>
            <p className="text-lg md:text-xl font-semibold text-sky-600 dark:text-sky-400">{plan.hydration}</p>
          </div>
        </Card>
      )}

      {plan.recoveryScore !== undefined && (
        <Card className={`mt-4 ${recoveryColor.bg} border ${recoveryColor.border}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-sm md:text-base ${recoveryColor.text}`}>Recovery Score</h3>
            <span className={`text-2xl md:text-3xl font-bold ${recoveryColor.text}`}>{Math.round(plan.recoveryScore)}</span>
          </div>
          <div className="w-full bg-slate-300 dark:bg-dark-bg rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${recoveryColor.text.replace('text-', 'bg-')}`}
              style={{ width: `${plan.recoveryScore}%` }}
            />
          </div>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-2">
            {plan.recoveryScore >= 80
              ? '✅ Great recovery conditions. Stick to your plan.'
              : plan.recoveryScore >= 60
                ? '⚠️ Good recovery conditions. Monitor energy levels.'
                : '⚠️ Lower recovery score. Prioritize sleep and rest.'}
          </p>
        </Card>
      )}

      {plan.dailyHabitTips && plan.dailyHabitTips.length > 0 && (
        <Card className="mt-4 bg-gradient-to-r from-purple-50 dark:from-purple-500/10 to-blue-50 dark:to-blue-500/10 border-purple-200 dark:border-purple-500/20">
          <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-3">💡 Daily Habit Tips</h3>
          <ul className="space-y-2">
            {plan.dailyHabitTips.map((tip, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-400 text-sm flex items-start gap-2">
                <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan.riskFlags && plan.riskFlags.length > 0 && (
        <Card className="mt-4 bg-gradient-to-r from-orange-50 dark:from-orange-500/10 to-red-50 dark:to-red-500/10 border-orange-200 dark:border-orange-500/20">
          <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-3">⚠️ Important Notes</h3>
          <ul className="space-y-2">
            {plan.riskFlags.map((flag, idx) => (
              <li key={idx} className="text-slate-700 dark:text-slate-400 text-sm flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {plan.groceryList && Object.keys(plan.groceryList).length > 0 && (
        <Card className="mt-4">
          <h3 className="font-semibold text-green-700 dark:text-green-400 mb-3">🛒 Shopping List</h3>
          <div className="space-y-3">
            {Object.entries(plan.groceryList).map(([category, items]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-1">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {items.slice(0, 5).map((item, idx) => (
                    <span key={idx} className="text-xs bg-green-100 dark:bg-green-500/10 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                  {items.length > 5 && (
                    <span className="text-xs text-gray-600 dark:text-slate-400 px-2 py-1">+{items.length - 5} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 mt-3">
            💡 Tip: Use this list to prep for the week. Buy in bulk for savings.
          </p>
        </Card>
      )}
    </div>
  );
}
