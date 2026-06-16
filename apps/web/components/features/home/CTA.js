'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-20">
      <div className="bg-ink-900 dark:bg-dark-surface rounded-[20px] px-8 py-12 md:py-16 text-center">
        <p className="text-[11.5px] font-semibold uppercase tracking-overline text-[rgba(246,245,242,0.45)] mb-4">
          Get started
        </p>
        <h2 className="font-display font-extrabold text-[clamp(26px,3.5vw,34px)] text-[#F6F5F2] tracking-tight leading-[1.1] mb-4 max-w-[28ch] mx-auto">
          {t.cta.heading}
        </h2>
        <p className="text-[15px] leading-[1.55] text-[rgba(246,245,242,0.6)] mb-8 max-w-[48ch] mx-auto">
          {t.cta.description}
        </p>
        <Link
          href="/create-plan"
          className="inline-flex items-center gap-2 px-7 py-[14px] bg-accent hover:bg-accent-600 text-accent-ink font-bold text-[15px] rounded-[13px] shadow-btn transition-colors"
        >
          {t.cta.button}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6"/>
          </svg>
        </Link>
      </div>
    </section>
  );
}
