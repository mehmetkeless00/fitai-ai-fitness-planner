'use client';

import { useLanguage } from '@/components/layout/LanguageProvider';

export default function HowItWorks() {
  const { t } = useLanguage();
  const s = t.howItWorks;

  return (
    <section id="how-it-works" className="py-12 md:py-20">
      <div className="text-center mb-10 md:mb-14 px-3">
        <p className="text-[11.5px] font-semibold uppercase tracking-overline text-ink-300 mb-3">
          How it works
        </p>
        <h2 className="font-display font-extrabold text-[clamp(26px,3.5vw,34px)] tracking-tight text-ink-900 dark:text-white leading-[1.1] mb-3">
          {s.heading}
        </h2>
        <p className="text-[15px] leading-[1.55] text-ink-500 max-w-[52ch] mx-auto">
          {s.subheading}
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Connector line (desktop) */}
        <div
          className="hidden md:block absolute top-[34px] left-[calc(33.33%-16px)] right-[calc(33.33%-16px)] h-px bg-line"
          aria-hidden="true"
        />

        {s.steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-paper dark:bg-dark-surface border border-line dark:border-dark-border rounded-[20px] p-6 shadow-card text-center"
          >
            <div className="relative inline-flex items-center justify-center w-[34px] h-[34px] mb-5 rounded-full bg-accent text-accent-ink font-bold text-[14px]">
              {idx + 1}
            </div>
            <h3 className="font-display font-bold text-[17px] text-ink-900 dark:text-white mb-2">
              {step.title}
            </h3>
            <p className="text-[14px] leading-[1.55] text-ink-500 dark:text-slate-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
