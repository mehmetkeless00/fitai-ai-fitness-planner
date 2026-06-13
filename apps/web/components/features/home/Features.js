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
            className="group text-left hover:border-sky-500/40 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/5"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/20 text-2xl transition-transform duration-200 group-hover:scale-110">
              {feature.emoji}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">{feature.title}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
