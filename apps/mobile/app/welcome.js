import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getActivePlan } from '@fitflow/core';
import { useLanguage } from '../i18n/LanguageContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const hasPlan = !!getActivePlan();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 items-center justify-center px-8 gap-6">
        <View className="w-20 h-20 rounded-2xl bg-sky-500 items-center justify-center">
          <Text className="text-white text-4xl font-bold">F</Text>
        </View>

        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            FitFlow
          </Text>
          <Text className="text-base text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            {t.welcome.headline}
          </Text>
          <Text className="text-sm text-slate-400 dark:text-slate-500 text-center">
            {t.welcome.sub}
          </Text>
        </View>

        <View className="w-full gap-3 mt-4">
          <Pressable
            className="w-full bg-sky-500 active:bg-sky-600 py-4 rounded-xl items-center"
            onPress={() => router.push('/create')}
            accessibilityRole="button"
            accessibilityLabel={t.welcome.cta}
          >
            <Text className="text-white font-semibold text-base">
              {t.welcome.cta}
            </Text>
          </Pressable>

          {hasPlan && (
            <Pressable
              className="w-full border border-slate-200 dark:border-slate-700 py-4 rounded-xl items-center"
              onPress={() => router.replace('/(tabs)/overview')}
              accessibilityRole="button"
              accessibilityLabel={t.welcome.havePlan}
            >
              <Text className="text-slate-700 dark:text-slate-300 font-medium text-base">
                {t.welcome.havePlan}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
