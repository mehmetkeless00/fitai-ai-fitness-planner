'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Error({ error, reset }) {
  const { t } = useLanguage();
  const s = t.errorPage;

  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 flex items-center">
        <Container>
          <div className="text-center max-w-lg mx-auto py-20">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {s.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-10 text-sm sm:text-base">
              {s.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={reset} className="w-full sm:w-auto">
                {s.retry}
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  {s.goHome}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
