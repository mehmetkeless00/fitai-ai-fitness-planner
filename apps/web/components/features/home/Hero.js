'use client';

import Link from 'next/link';
import EnergyRing from '@/components/ui/EnergyRing';
import { useLanguage } from '@/components/layout/LanguageProvider';

// Static preview data — purely decorative, not real plan data
const PREVIEW = {
  energyEaten: 1690,
  energyTotal: 2450,
  protein: { eaten: 186, target: 238 },
  carbs:   { eaten: 240, target: 300 },
  fat:     { eaten: 62,  target: 82 },
};

function PreviewCard({ t }) {
  const p = t.hero.preview;
  const energyPct = PREVIEW.energyEaten / PREVIEW.energyTotal;
  const proteinPct = PREVIEW.protein.eaten / PREVIEW.protein.target;

  return (
    <div className="relative w-full max-w-[440px] mx-auto" aria-hidden="true">
      <div className="bg-ink-900 rounded-[26px] p-6 text-[#F6F5F2] shadow-[0_30px_60px_-24px_rgba(20,22,30,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[rgba(246,245,242,0.55)]">Wednesday · Week 3</p>
            <p className="font-display font-bold text-[17px] mt-0.5">{p.title}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[rgba(20,192,106,0.16)] text-[#5FE0A0] text-[11.5px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            On track
          </span>
        </div>

        {/* Ring + numbers */}
        <div className="flex items-center gap-5 mt-5">
          <EnergyRing size={112} strokeWidth={11} energyProgress={energyPct} proteinProgress={proteinPct} />

          <div>
            <p className="font-display font-extrabold text-[32px] leading-none tabular-nums tracking-[-0.03em]">
              {PREVIEW.energyEaten.toLocaleString()}
            </p>
            <p className="text-[12px] text-[rgba(246,245,242,0.55)] mt-1">
              of {PREVIEW.energyTotal.toLocaleString()} kcal
            </p>

            {/* Macro row */}
            <div className="flex gap-4 mt-3">
              {[
                { label: p.protein, value: `${PREVIEW.protein.eaten}g`, color: '#5FE0A0' },
                { label: p.carbs,   value: `${PREVIEW.carbs.eaten}g`,   color: '#F5A524' },
                { label: p.fat,     value: `${PREVIEW.fat.eaten}g`,     color: '#7C8CFF' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className="text-[11px] text-[rgba(246,245,242,0.5)]">{label}</p>
                  <p className="font-bold text-[13px] tabular-nums mt-0.5" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workout row */}
        <div className="flex items-center gap-3 bg-[rgba(246,245,242,0.06)] rounded-[14px] px-3.5 py-3 mt-4">
          <div className="w-10 h-10 rounded-[11px] bg-[rgba(20,192,106,0.18)] flex items-center justify-center flex-shrink-0">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#5FE0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5l11 11M4 9l-2 2 2 2M20 15l2-2-2-2M8 8l8 8"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[13.5px]">{p.workoutValue}</p>
            <p className="text-[11.5px] text-[rgba(246,245,242,0.55)]">6 exercises · 50 min</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(246,245,242,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLanguage();

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Strip leading emoji from badge string
  const badgeText = t.hero.badge.replace(/^\p{Emoji}+\s*/u, '');

  return (
    <div className="py-12 md:py-20">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left">
          {/* Eyebrow chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-wash text-accent-600 text-[12.5px] font-semibold rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            {badgeText}
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-[clamp(40px,5vw,60px)] leading-[0.98] tracking-display text-ink-900 dark:text-white mb-5">
            {t.hero.title1}
            <br />
            {t.hero.title2}
          </h1>

          {/* Body */}
          <p className="text-[17px] leading-[1.55] text-ink-500 max-w-[42ch] mx-auto lg:mx-0 mb-7">
            {t.hero.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
            <Link
              href="/create-plan"
              className="inline-flex items-center justify-center gap-2 px-6 py-[14px] bg-accent hover:bg-accent-600 text-accent-ink font-bold text-[15px] rounded-[13px] shadow-btn transition-colors"
            >
              {t.hero.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </Link>
            <button
              onClick={handleLearnMore}
              className="inline-flex items-center justify-center px-6 py-[14px] bg-paper border border-line text-ink-900 font-semibold text-[15px] rounded-[13px] hover:border-ink-300 transition-colors"
            >
              {t.hero.learnMore}
            </button>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center lg:justify-start">
            {t.hero.trust.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-accent-wash flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                </span>
                <span className="text-[13px] text-ink-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview card */}
        <PreviewCard t={t} />
      </div>
    </div>
  );
}
