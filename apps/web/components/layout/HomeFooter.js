'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function HomeFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-canvas dark:bg-dark-bg border-t border-line dark:border-dark-border py-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[6px] bg-accent flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#062815" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5l11 11M8 8l8 8"/>
              </svg>
            </div>
            <span className="font-display font-bold text-[14px] text-ink-900 dark:text-white">FitFlow</span>
            <span className="text-[13px] text-ink-300 dark:text-slate-600">
              · Web Design System · v1.0 · {new Date().getFullYear()}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-[13px] text-ink-500">
            <Link href="/privacy" className="hover:text-ink-900 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-line dark:text-dark-border">·</span>
            <a href="mailto:support@fitflow.app" className="hover:text-ink-900 transition-colors">
              Contact
            </a>
            <span className="text-line dark:text-dark-border">·</span>
            <span className="text-ink-300 text-[12px]">
              © {new Date().getFullYear()} {t.footer.copyright.split('.')[0]}.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
