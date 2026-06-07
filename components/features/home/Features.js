'use client';

import Card from '../../ui/Card';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features-section" className="py-12 md:py-20">
      <div className="text-center mb-8 md:mb-12 px-3">
        <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-4">
          {t.features.heading}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.features.subheading}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {t.features.items.map((feature, idx) => (
          <Card
            key={idx}
            className="text-center hover:border-sky-500/30 transition-all hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">{feature.emoji}</div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
