import { View, Text, ScrollView, Pressable, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

function SectionHeader({ title }) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-widest text-ink-300 dark:text-slate-500 mb-2 mt-4 px-1">
      {title}
    </Text>
  );
}

function OptionRow({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-3 rounded-[12px] mb-2 ${
        selected
          ? 'bg-accent-wash dark:bg-accent/10 border border-accent dark:border-accent/50'
          : 'bg-paper dark:bg-slate-800 border border-line dark:border-slate-700'
      }`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? 'text-accent-600 dark:text-accent' : 'text-ink-700 dark:text-slate-300'
        }`}
      >
        {label}
      </Text>
      {selected && <Text className="text-accent">✓</Text>}
    </Pressable>
  );
}

export default function SettingsModal() {
  const router = useRouter();
  const { lang, setLang, t, units, setUnits, notifications, setNotifications } = useLanguage();
  const s = t.settings;

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold text-ink-900 dark:text-white" accessibilityRole="header">
            {s.title}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-4 py-2 rounded-full bg-paper border border-line dark:bg-slate-800 dark:border-slate-700"
            accessibilityRole="button"
            accessibilityLabel={s.close}
          >
            <Text className="text-ink-500 dark:text-slate-300 font-medium text-sm">{s.close}</Text>
          </Pressable>
        </View>

        {/* Language */}
        <SectionHeader title={s.language} />
        <OptionRow label={s.english} selected={lang === 'en'} onPress={() => setLang('en')} />
        <OptionRow label={s.turkish} selected={lang === 'tr'} onPress={() => setLang('tr')} />

        {/* Units */}
        <SectionHeader title={s.units} />
        <OptionRow label={s.unitKg} selected={units === 'kg'} onPress={() => setUnits('kg')} />
        <OptionRow label={s.unitLbs} selected={units === 'lbs'} onPress={() => setUnits('lbs')} />

        {/* Notifications */}
        <SectionHeader title={s.notifications} />
        <View className="bg-paper dark:bg-slate-800 border border-line dark:border-slate-700 rounded-[12px] px-4 py-3 mb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">
                {s.notifications}
              </Text>
              <Text className="text-xs text-ink-300 dark:text-slate-500 mt-0.5">
                {s.notificationsDesc}
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E7E6E1', true: '#14C06A' }}
              thumbColor="#ffffff"
              accessibilityRole="switch"
              accessibilityState={{ checked: notifications }}
              accessibilityLabel={s.notifications}
            />
          </View>
        </View>

        {/* Cloud Sync */}
        <SectionHeader title={s.cloudSync} />
        <View className="bg-paper dark:bg-slate-800 border border-line dark:border-slate-700 rounded-[12px] px-4 py-4 mb-2">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-sm text-ink-500 dark:text-slate-400 flex-1">
              {s.cloudSyncDesc}
            </Text>
            <View className="bg-canvas dark:bg-slate-700 px-2.5 py-1 rounded-md border border-line dark:border-slate-600">
              <Text className="text-xs font-semibold text-ink-300 dark:text-slate-400">
                {s.comingSoon}
              </Text>
            </View>
          </View>
        </View>

        {/* About */}
        <SectionHeader title={s.about} />
        <View className="bg-paper dark:bg-slate-800 border border-line dark:border-slate-700 rounded-[12px] overflow-hidden mb-2">
          {/* Version row */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <Text className="text-sm text-ink-500 dark:text-slate-400">{s.versionLabel}</Text>
            <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{s.version}</Text>
          </View>

          <View className="h-px bg-line dark:bg-slate-700 mx-4" />

          {/* Privacy Policy */}
          <Pressable
            onPress={() => router.push('/modal/privacy')}
            className="flex-row items-center justify-between px-4 py-3"
            accessibilityRole="button"
            accessibilityLabel={s.privacyPolicy}
          >
            <View className="flex-1">
              <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{s.privacyPolicy}</Text>
              <Text className="text-xs text-ink-300 dark:text-slate-500 mt-0.5">{s.privacyPolicyDesc}</Text>
            </View>
            <Text className="text-ink-300 dark:text-slate-500 text-base">›</Text>
          </Pressable>

          <View className="h-px bg-line dark:bg-slate-700 mx-4" />

          {/* Terms (placeholder) */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <View className="flex-1">
              <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{s.terms}</Text>
              <Text className="text-xs text-ink-300 dark:text-slate-500 mt-0.5">{s.termsDesc}</Text>
            </View>
            <View className="bg-canvas dark:bg-slate-700 px-2 py-0.5 rounded-md border border-line dark:border-slate-600">
              <Text className="text-xs text-ink-300 dark:text-slate-400">{s.comingSoon}</Text>
            </View>
          </View>

          <View className="h-px bg-line dark:bg-slate-700 mx-4" />

          {/* Contact */}
          <Pressable
            onPress={() => Linking.openURL(`mailto:${s.contactEmail}`)}
            className="flex-row items-center justify-between px-4 py-3"
            accessibilityRole="button"
            accessibilityLabel={s.contact}
          >
            <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{s.contact}</Text>
            <Text className="text-xs text-accent">{s.contactEmail}</Text>
          </Pressable>

          <View className="h-px bg-line dark:bg-slate-700 mx-4" />

          {/* Offline-first notice */}
          <View className="px-4 py-3">
            <Text className="text-xs text-ink-300 dark:text-slate-500">{s.offlineFirst}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
