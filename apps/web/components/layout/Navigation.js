'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeContext } from '@/components/layout/ThemeProvider';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useAuth } from '@/components/layout/AuthProvider';

function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 ${
        isActive
          ? 'bg-[#F0EFEA] dark:bg-ink-900/60 text-ink-900 dark:text-white font-semibold'
          : 'text-ink-500 hover:text-ink-900 dark:hover:text-white font-medium hover:bg-[#F0EFEA]/80 dark:hover:bg-ink-900/40'
      }`}
    >
      {children}
    </Link>
  );
}

function LogoIcon() {
  return (
    <div className="w-7 h-7 rounded-[8px] bg-accent flex items-center justify-center flex-shrink-0">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#062815" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.5 6.5l11 11M4 9l-2 2 2 2M9 4l2-2 2 2M20 15l2-2-2-2M15 20l-2 2-2-2M8 8l8 8"/>
      </svg>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Navigation() {
  const themeContext = useContext(ThemeContext);
  const { t, lang, toggleLanguage } = useLanguage();
  const { user, isCloudEnabled, signOut } = useAuth();
  const mainLabel = lang === 'tr' ? 'Ana içeriğe geç' : 'Skip to main content';

  const authControl = isCloudEnabled ? (
    user ? (
      <button
        onClick={signOut}
        title={user.email}
        className="hidden sm:inline text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors"
      >
        {t.auth.signOut}
      </button>
    ) : (
      <Link
        href="/auth"
        className="hidden sm:inline text-sm font-medium text-ink-500 hover:text-ink-900 transition-colors"
      >
        {t.auth.signIn}
      </Link>
    )
  ) : null;

  const navLinks = (
    <>
      <NavLink href="/">{t.nav.home}</NavLink>
      <NavLink href="/plans">{t.nav.myPlans}</NavLink>
      <NavLink href="/create-plan">{t.nav.createPlan}</NavLink>
    </>
  );

  const logo = (
    <Link href="/" className="flex items-center gap-2.5">
      <LogoIcon />
      <span className="font-display font-bold text-[17px] text-ink-900 dark:text-white tracking-[-0.02em]">
        FitFlow
      </span>
    </Link>
  );

  const langButton = (
    <button
      onClick={toggleLanguage}
      className="px-2.5 py-1.5 border border-line text-ink-500 hover:text-ink-900 hover:border-ink-300 rounded-[8px] text-xs font-semibold transition-all"
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'TR' : 'EN'}
    </button>
  );

  const themeButton = themeContext && (
    <button
      onClick={themeContext.toggleTheme}
      className="w-8 h-8 flex items-center justify-center border border-line text-ink-500 hover:text-ink-900 hover:border-ink-300 rounded-[8px] transition-all"
      aria-label="Toggle theme"
    >
      {themeContext.isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-paper dark:bg-dark-bg/95 backdrop-blur-md border-b border-line dark:border-dark-border">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-ink focus:rounded-[8px] focus:text-sm focus:font-medium"
      >
        {mainLabel}
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {logo}

          <div className="flex items-center gap-0.5 ml-6">
            {navLinks}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {authControl}
            {langButton}
            {themeButton}
            <Link
              href="/create-plan"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-ink-900 hover:bg-ink-700 text-white text-sm font-semibold rounded-[10px] transition-colors"
            >
              {t.nav.createPlan}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
