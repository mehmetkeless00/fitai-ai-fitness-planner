import { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileStrings } from './strings';

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLang = 'en' }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    AsyncStorage.setItem('fitflow.lang', newLang);
  }, []);

  const t = mobileStrings[lang] ?? mobileStrings.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
