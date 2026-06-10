'use client';

import Link from 'next/link';
import Button from '../../ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

function AppPreviewCard({ t }) {
  const p = t.hero.preview;

  return (
    <div className="relative max-w-md w-full mx-auto" aria-hidden="true">
      {/* Glow behind the card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-blue-500/15 to-purple-500/20 rounded-3xl blur-2xl" />

      <div className="relative bg-white/95 dark:bg-dark-surface/90 backdrop-blur border border-slate-200 dark:border-dark-border rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 p-5 space-y-4">
        {/* Window chrome */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-dark-border">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">{p.title}</span>
        </div>

        {/* Calories */}
        <div className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{p.calories}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">2,450 <span className="text-sm font-medium text-slate-500 dark:text-slate-400">kcal</span></p>
          </div>
          <span className="text-3xl">🔥</span>
        </div>

        {/* Macro bars */}
        <div className="space-y-2.5">
          {[
            { label: p.protein, pct: 32, grad: 'from-red-500 to-pink-500', text: 'text-red-600 dark:text-red-400' },
            { label: p.carbs, pct: 48, grad: 'from-yellow-500 to-orange-500', text: 'text-yellow-600 dark:text-yellow-400' },
            { label: p.fat, pct: 20, grad: 'from-green-500 to-emerald-500', text: 'text-green-600 dark:text-green-400' },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{m.label}</span>
                <span className={`font-semibold ${m.text}`}>{m.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-dark-bg rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${m.grad} rounded-full`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Today's workout + next meal rows */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-dark-border rounded-xl p-3">
            <span className="text-xl">💪</span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">{p.workoutLabel}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.workoutValue}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-dark-bg/50 border border-slate-200 dark:border-dark-border rounded-xl p-3">
            <span className="text-xl">🥗</span>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">{p.mealLabel}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.mealValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative py-12 md:py-24">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-block mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500/10 border border-sky-500/20 rounded-full">
            <p className="text-sky-600 dark:text-sky-400 text-xs sm:text-sm font-medium">{t.hero.badge}</p>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
            {t.hero.title1}
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              {t.hero.title2}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 mb-7">
            {t.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-7">
            <Link href="/create-plan" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">{t.hero.cta}</Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleLearnMore} className="w-full sm:w-auto">
              {t.hero.learnMore}
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start text-sm text-slate-600 dark:text-slate-300">
            {t.hero.trust.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <span className="text-green-500 font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* App preview mockup */}
        <AppPreviewCard t={t} />
      </div>
    </div>
  );
}
