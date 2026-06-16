import { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileStrings } from './strings';

const LanguageContext = createContext(null);

export function LanguageProvider({
  children,
  initialLang = 'en',
  initialUnits = 'kg',
  initialNotifications = false,
}) {
  const [lang, setLangState] = useState(initialLang);
  const [units, setUnitsState] = useState(initialUnits);
  const [notifications, setNotificationsState] = useState(initialNotifications);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    AsyncStorage.setItem('fitflow.lang', newLang);
  }, []);

  const setUnits = useCallback((newUnits) => {
    setUnitsState(newUnits);
    AsyncStorage.setItem('fitflow.units', newUnits);
  }, []);

  const setNotifications = useCallback((value) => {
    setNotificationsState(value);
    AsyncStorage.setItem('fitflow.notifications', value ? 'true' : 'false');
  }, []);

  const t = mobileStrings[lang] ?? mobileStrings.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, units, setUnits, notifications, setNotifications }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
