'use client';

import { useState, useEffect, createContext } from 'react';
import './globals.css';

export const ThemeContext = createContext();

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      setIsDark(true);
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    if (newIsDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(newIsDark);
  };

  return (
    <html lang="en" className={mounted ? (isDark ? 'dark' : 'light') : 'dark'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered personalized fitness and nutrition plans" />
        <title>FitAI - Your Personal Fitness Coach</title>
      </head>
      <body>
        <ThemeProvider theme={isDark} toggleTheme={toggleTheme} mounted={mounted}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

function ThemeProvider({ children, theme, toggleTheme, mounted }) {
  if (!mounted) return children;

  return (
    <ThemeContext.Provider value={{ isDark: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

