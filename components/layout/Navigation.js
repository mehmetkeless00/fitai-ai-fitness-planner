'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { ThemeContext } from '@/app/layout';

export default function Navigation() {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
                💪
              </div>
              FitAI
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-white hover:text-sky-400 transition-colors text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/create-plan"
                className="text-white hover:text-sky-400 transition-colors text-sm font-medium"
              >
                Create Plan
              </Link>
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
              💪
            </div>
            FitAI
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-white hover:text-sky-400 transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/create-plan"
              className="text-white hover:text-sky-400 transition-colors text-sm font-medium"
            >
              Create Plan
            </Link>
            <button
              className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-all"
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
