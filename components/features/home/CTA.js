'use client';

import Link from 'next/link';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-20 px-3">
      <Card className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-sky-500/20 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
          {t.cta.heading}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
          {t.cta.description}
        </p>
        <Link href="/create-plan">
          <Button size="lg" className="w-full sm:w-auto">{t.cta.button}</Button>
        </Link>
      </Card>
    </section>
  );
}
