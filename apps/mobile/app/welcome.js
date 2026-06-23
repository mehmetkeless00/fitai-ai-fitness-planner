import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getActivePlan } from '@fitflow/core';
import { useLanguage } from '../i18n/LanguageContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const hasPlan = !!getActivePlan();

  const features = [
    { icon: 'radio-outline',      color: '#0E8A4C', text: t.welcome.feature1 },
    { icon: 'barbell-outline',    color: '#0E8A4C', text: t.welcome.feature2 },
    { icon: 'trending-up-outline',color: '#0E8A4C', text: t.welcome.feature3 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <View className="flex-1 px-7 pt-16 pb-8">

        {/* App icon */}
        <View
          className="items-center justify-center"
          style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: '#14C06A',
            shadowColor: '#14C06A', shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.45, shadowRadius: 20, elevation: 8 }}
        >
          <Ionicons name="chevron-up" size={30} color="#062815" />
        </View>

        {/* Headline */}
        <Text
          className="text-ink-900 dark:text-white mt-7"
          style={{ fontSize: 42, fontWeight: '800', letterSpacing: -1.2, lineHeight: 46 }}
        >
          {t.welcome.headline.split(',').map((line, i) => (
            <Text key={i}>{i > 0 ? ',\n' + line : line}</Text>
          ))}
        </Text>

        {/* Sub */}
        <Text className="text-base text-ink-500 dark:text-slate-400 mt-4 leading-relaxed">
          {t.welcome.sub}
        </Text>

        {/* Benefit rows */}
        <View className="mt-8 gap-4">
          {features.map((f, i) => (
            <View key={i} className="flex-row items-center gap-4">
              <View
                className="items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#E8F8EF' }}
              >
                <Ionicons name={f.icon} size={20} color={f.color} />
              </View>
              <Text className="text-sm font-medium text-ink-700 dark:text-slate-300 flex-1" style={{ lineHeight: 20 }}>
                {f.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        {/* CTAs */}
        <View className="gap-3">
          <Pressable
            onPress={() => router.push('/create')}
            className="bg-accent active:bg-accent-600 rounded-[14px] items-center"
            style={{ minHeight: 54, justifyContent: 'center',
              shadowColor: '#14C06A', shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 }}
            accessibilityRole="button"
            accessibilityLabel={t.welcome.cta}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-[#062815] font-bold text-base">{t.welcome.cta}</Text>
              <Ionicons name="arrow-forward" size={17} color="#062815" />
            </View>
          </Pressable>

          {hasPlan && (
            <Pressable
              onPress={() => router.replace('/(tabs)/overview')}
              className="border border-line dark:border-slate-700 bg-paper dark:bg-slate-800 rounded-[14px] items-center"
              style={{ minHeight: 52, justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={t.welcome.havePlan}
            >
              <Text className="text-ink-700 dark:text-slate-300 font-medium text-base">
                {t.welcome.havePlan}
              </Text>
            </Pressable>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}
