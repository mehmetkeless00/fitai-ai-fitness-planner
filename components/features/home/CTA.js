'use client';

import Link from 'next/link';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function CTA() {
  return (
    <section className="py-20">
      <Card className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-sky-500/20 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Fitness?</h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Create your personalized workout and meal plan in just 3 minutes. No experience necessary.
        </p>
        <Link href="/create-plan">
          <Button size="lg">Get Started Now →</Button>
        </Link>
      </Card>
    </section>
  );
}
