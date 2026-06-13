'use client';

import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function NotFoundContent() {
  const { t } = useLanguage();
  const s = t.notFound;

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 pb-12 flex items-center">
        <Container>
          <div className="text-center max-w-lg mx-auto py-20">
            <p className="text-8xl sm:text-9xl font-bold text-sky-500 mb-4 leading-none">
              404
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {s.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-10 text-sm sm:text-base">
              {s.line1}
              <br />
              {s.line2}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  {s.goHome}
                </Button>
              </Link>
              <Link href="/create-plan" className="w-full sm:w-auto">
                <Button size="lg" className="w-full">
                  {s.createPlan}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
