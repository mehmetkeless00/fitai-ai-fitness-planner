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
        {/* Brand mark: dark navy box with blue + green wave swooshes and leaf */}
        <View className="w-20 h-20 rounded-2xl bg-[#091220] items-center justify-center overflow-hidden">
          {/* Blue wave */}
          <View style={{
            position: 'absolute', bottom: 32, left: -8, right: -8,
            height: 26, borderRadius: 13, backgroundColor: '#1ED8FF',
            transform: [{ rotate: '-10deg' }], opacity: 0.88,
          }} />
          {/* Green wave */}
          <View style={{
            position: 'absolute', bottom: 10, left: -8, right: -8,
            height: 18, borderRadius: 9, backgroundColor: '#14C06A',
            transform: [{ rotate: '-10deg' }], opacity: 0.88,
          }} />
          {/* Leaf teardrop */}
          <View style={{
            position: 'absolute', top: 10, right: 16,
            width: 11, height: 17, borderRadius: 7,
            backgroundColor: '#22E272',
            transform: [{ rotate: '-15deg' }],
          }} />
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

        <View className="w-full gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
          {[
            { icon: '🎯', text: t.welcome.feature1 },
            { icon: '🍽️', text: t.welcome.feature2 },
            { icon: '📈', text: t.welcome.feature3 },
          ].map((f) => (
            <View key={f.icon} className="flex-row items-center gap-3">
              <Text style={{ fontSize: 20 }}>{f.icon}</Text>
              <Text className="text-sm text-slate-600 dark:text-slate-300 flex-1">{f.text}</Text>
            </View>
          ))}
        </View>

        <View className="w-full gap-3 mt-4">
          <Pressable
            className="w-full bg-accent active:bg-accent-600 py-4 rounded-xl items-center"
            onPress={() => router.push('/create')}
            accessibilityRole="button"
            accessibilityLabel={t.welcome.cta}
          >
            <Text className="text-[#062815] font-semibold text-base">
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
