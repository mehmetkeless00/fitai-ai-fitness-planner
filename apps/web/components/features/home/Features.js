'use client';

import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features-section" className="py-12 md:py-20">
      <div className="text-center mb-10 md:mb-14 px-3">
        <p className="text-[11.5px] font-semibold uppercase tracking-overline text-ink-300 mb-3">
          Features
        </p>
        <h2 className="font-display font-extrabold text-[clamp(26px,3.5vw,34px)] tracking-tight text-ink-900 dark:text-white leading-[1.1] mb-3">
          {t.features.heading}
        </h2>
        <p className="text-[15px] leading-[1.55] text-ink-500 max-w-[52ch] mx-auto">
          {t.features.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {t.features.items.map((feature, idx) => (
          <div
            key={idx}
            className="bg-paper dark:bg-dark-surface border border-line dark:border-dark-border rounded-[20px] p-6 shadow-flat hover:shadow-card hover:border-accent/30 transition-all duration-200 group"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 mb-4 rounded-[10px] bg-accent-wash border border-accent/20 text-xl transition-transform duration-200 group-hover:scale-110">
              {feature.emoji}
            </div>
            <h3 className="font-display font-bold text-[16px] text-ink-900 dark:text-white mb-1.5">
              {feature.title}
            </h3>
            <p className="text-[13.5px] leading-[1.55] text-ink-500 dark:text-slate-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
