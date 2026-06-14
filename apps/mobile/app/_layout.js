import '../global.css';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setStorageAdapter } from '@fitflow/core';
import { initStorage, asyncAdapter } from '../storage/asyncAdapter';
import { LanguageProvider } from '../i18n/LanguageContext';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [initialLang, setInitialLang] = useState('en');

  useEffect(() => {
    (async () => {
      await initStorage();
      setStorageAdapter(asyncAdapter);
      const lang = await AsyncStorage.getItem('fitflow.lang');
      if (lang === 'tr') setInitialLang('tr');
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <LanguageProvider initialLang={initialLang}>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}
