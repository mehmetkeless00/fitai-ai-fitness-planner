'use client';

import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import Hero from '@/components/features/home/Hero';
import Features from '@/components/features/home/Features';
import CTA from '@/components/features/home/CTA';

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20">
        <Container>
          <Hero />
          <Features />
          <CTA />
        </Container>
      </main>

      <footer className="bg-slate-50 dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border py-8 mt-12 md:mt-20">
        <Container className="text-center text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
          <p>© 2024 FitAI. All rights reserved. Built with 💪 and ❤️</p>
        </Container>
      </footer>
    </>
  );
}
