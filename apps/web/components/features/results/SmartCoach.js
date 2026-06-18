'use client';

import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { generateCoachNarrative } from '@fitflow/core';

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
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-[10px] bg-accent flex items-center justify-center text-base shadow-[0_2px_8px_-2px_rgba(20,192,106,0.4)]">
          🎯
        </div>
        <h3 className="font-semibold text-ink-900 text-sm">Smart Coach</h3>
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
              <span className="text-ink-700 leading-relaxed">{text}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
