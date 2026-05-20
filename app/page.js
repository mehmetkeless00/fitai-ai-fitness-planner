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
      <main className="min-h-screen pt-16">
        <Container>
          <Hero />
          <Features />
          <CTA />
        </Container>
      </main>

      <footer className="bg-dark-surface border-t border-dark-border py-8 mt-20">
        <Container className="text-center text-slate-400 text-sm">
          <p>© 2024 FitAI. All rights reserved. Built with 💪 and ❤️</p>
        </Container>
      </footer>
    </>
  );
}
