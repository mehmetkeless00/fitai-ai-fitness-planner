'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { translations } from '@fitflow/core';

export const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  const lang = context?.lang || 'en';
  return {
    lang,
    toggleLanguage: context?.toggleLanguage || (() => {}),
    t: translations[lang],
  };
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('lang');
    if (stored === 'tr') setLang('tr');
  }, []);

  // Keep <html lang> in sync so screen readers use the right pronunciation rules
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'tr' : 'en';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  if (!mounted) return <>{children}</>;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
