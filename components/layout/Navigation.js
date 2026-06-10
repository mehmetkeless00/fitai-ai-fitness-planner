'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '@/components/layout/ThemeProvider';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function Navigation() {
  const themeContext = useContext(ThemeContext);
  const { t, lang, toggleLanguage } = useLanguage();

  const navLinks = (
    <>
      <Link
        href="/"
        className="hidden sm:inline text-slate-700 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-sm font-medium"
      >
        {t.nav.home}
      </Link>
      <Link
        href="/create-plan"
        className="text-slate-700 dark:text-white hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-sm font-medium"
      >
        {t.nav.createPlan}
      </Link>
    </>
  );

  const logo = (
    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
      <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-sky-500/30">
        💪
      </div>
      <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        FitFlow
      </span>
    </Link>
  );

  const langButton = (
    <button
      onClick={toggleLanguage}
      className="px-2.5 py-1.5 border border-slate-300 dark:border-dark-border text-slate-700 dark:text-slate-300 hover:border-sky-500 hover:text-sky-500 dark:hover:text-sky-400 rounded-lg text-xs font-semibold transition-all"
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'TR' : 'EN'}
    </button>
  );

  if (!themeContext) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {logo}
            <div className="flex items-center gap-2 md:gap-4">
              {navLinks}
              {langButton}
              <button className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-all">
                🌙
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-bg/80 backdrop-blur-md border-b border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {logo}

          <div className="flex items-center gap-2 md:gap-4">
            {navLinks}
            {langButton}
            <button
              className="px-3 md:px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-all"
              onClick={themeContext.toggleTheme}
              aria-label="Toggle theme"
            >
              {themeContext.isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
