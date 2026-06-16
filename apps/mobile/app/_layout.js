import '../global.css';
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { setStorageAdapter } from '@fitflow/core';
import { initStorage, asyncAdapter } from '../storage/asyncAdapter';
import { LanguageProvider } from '../i18n/LanguageContext';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'SchibstedGrotesk-Regular': require('../assets/fonts/SchibstedGrotesk-Regular.ttf'),
    'SchibstedGrotesk-Bold': require('../assets/fonts/SchibstedGrotesk-Bold.ttf'),
    'SchibstedGrotesk-ExtraBold': require('../assets/fonts/SchibstedGrotesk-ExtraBold.ttf'),
    'HankenGrotesk-Regular': require('../assets/fonts/HankenGrotesk-Regular.ttf'),
    'HankenGrotesk-SemiBold': require('../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold': require('../assets/fonts/HankenGrotesk-Bold.ttf'),
  });
  const [initialLang, setInitialLang] = useState('en');
  const [initialUnits, setInitialUnits] = useState('kg');
  const [initialNotifications, setInitialNotifications] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initStorage();
        setStorageAdapter(asyncAdapter);
        const lang = await AsyncStorage.getItem('fitflow.lang');
        if (lang === 'tr') setInitialLang('tr');
        const units = await AsyncStorage.getItem('fitflow.units');
        if (units === 'lbs') setInitialUnits('lbs');
        const notifications = await AsyncStorage.getItem('fitflow.notifications');
        if (notifications === 'true') setInitialNotifications(true);
      } catch {
        // Storage init failed — app continues with defaults
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready || !fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-slate-900">
        <ActivityIndicator size="large" color="#14C06A" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <LanguageProvider
        initialLang={initialLang}
        initialUnits={initialUnits}
        initialNotifications={initialNotifications}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="modal/exercise" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modal/settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="modal/privacy" options={{ presentation: 'modal' }} />
        </Stack>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
