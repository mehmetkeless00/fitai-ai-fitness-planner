'use client';

import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function HowItWorks() {
  const { t } = useLanguage();
  const s = t.howItWorks;

  return (
    <section className="py-12 md:py-20">
      <div className="text-center mb-8 md:mb-12 px-3">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">
          {s.heading}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {s.subheading}
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Connector line (desktop only) */}
        <div
          className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-sky-500/0 via-sky-500/40 to-sky-500/0"
          aria-hidden="true"
        />

        {s.steps.map((step, idx) => (
          <Card key={idx} className="relative text-center hover:border-sky-500/30 transition-all">
            <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white text-lg font-bold shadow-lg shadow-sky-500/30">
              {idx + 1}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
