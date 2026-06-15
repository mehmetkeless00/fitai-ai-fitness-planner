import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

function SectionHeader({ title }) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 mt-4 px-1">
      {title}
    </Text>
  );
}

function OptionRow({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-2 ${
        selected
          ? 'bg-sky-50 dark:bg-sky-900/30 border border-sky-300 dark:border-sky-700'
          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700'
      }`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? 'text-sky-700 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300'
        }`}
      >
        {label}
      </Text>
      {selected && <Text className="text-sky-500">✓</Text>}
    </Pressable>
  );
}

export default function SettingsModal() {
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();
  const s = t.settings;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xl font-bold text-slate-900 dark:text-white" accessibilityRole="header">
            {s.title}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700"
            accessibilityRole="button"
            accessibilityLabel={s.close}
          >
            <Text className="text-slate-600 dark:text-slate-300 font-medium text-sm">{s.close}</Text>
          </Pressable>
        </View>

        {/* Language */}
        <SectionHeader title={s.language} />
        <OptionRow
          label={s.english}
          selected={lang === 'en'}
          onPress={() => setLang('en')}
        />
        <OptionRow
          label={s.turkish}
          selected={lang === 'tr'}
          onPress={() => setLang('tr')}
        />

        {/* About */}
        <SectionHeader title={s.about} />
        <View className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-4 gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-slate-500 dark:text-slate-400">Version</Text>
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{s.version}</Text>
          </View>
          <View className="h-px bg-slate-100 dark:bg-slate-700" />
          <Text className="text-xs text-slate-400 dark:text-slate-500">{s.offlineFirst}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
