'use client';

import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { generateCoachNarrative } from '../../../utils/generateSmartPlan';

const ROWS = [
  { key: 'headline', icon: '🏁' },
  { key: 'trend', icon: '📈' },
  { key: 'adherence', icon: '📅' },
  { key: 'recovery', icon: '❤️' },
  { key: 'recommendation', icon: '💡' },
];

export default function SmartCoach({ plan, checkins }) {
  const { t } = useLanguage();
  const narrative = generateCoachNarrative(plan, checkins, t.coach);

  return (
    <Card className="bg-gradient-to-br from-sky-50 via-white dark:via-transparent to-blue-50 dark:from-sky-500/10 dark:to-blue-500/10 border-sky-200 dark:border-sky-500/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-base shadow shadow-sky-500/30">
          🎯
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Smart Coach</h3>
      </div>
      <ul className="space-y-3">
        {ROWS.map(({ key, icon }) => {
          const text = narrative[key];
          if (!text) return null;
          return (
            <li key={key} className="flex items-start gap-3 text-sm">
              <span className="text-base leading-none mt-0.5 shrink-0" aria-hidden="true">
                {icon}
              </span>
              <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{text}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
