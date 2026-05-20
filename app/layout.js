'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered personalized fitness and nutrition plans" />
        <title>FitAI - Your Personal Fitness Coach</title>
      </head>
      <body className="bg-dark-bg text-white">
        <ThemeProvider theme={isDark} toggleTheme={toggleTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export const ThemeContext = require('react').createContext();

function ThemeProvider({ children, theme, toggleTheme }) {
  return (
    <ThemeContext.Provider value={{ isDark: theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
