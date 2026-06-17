import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCreatePlan } from '../../contexts/createPlanContext';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import StepStrip from '../../components/ui/StepStrip';

const GOAL_ICONS = {
  'lose-weight': '⚡',
  'build-muscle': '💪',
  maintenance: '⚖️',
  endurance: '🏃',
  flexibility: '🧘',
  'general-fitness': '🎯',
  performance: '🏆',
};

const EXP_ICONS = {
  beginner: '🌱',
  intermediate: '📈',
  advanced: '🔥',
  elite: '⚡',
};

export default function Step2() {
  const router = useRouter();
  const { t } = useLanguage();
  const { formData, update } = useCreatePlan();
  const c = t.create;

  const [errors, setErrors] = useState({});

  const goalOptions = [
    { value: 'lose-weight', label: c.loseWeight },
    { value: 'build-muscle', label: c.buildMuscle },
    { value: 'maintenance', label: c.maintain },
  ];

  const experienceOptions = [
    { value: 'beginner', label: c.beginner },
    { value: 'intermediate', label: c.intermediate },
    { value: 'advanced', label: c.advanced },
  ];

  const freqOptions = [3, 4, 5, 6, 7].map((n) => ({ value: n, label: String(n) }));

  function validate() {
    const errs = {};
    if (!formData.fitnessGoal) errs.fitnessGoal = c.errors.goal;
    if (!formData.experience) errs.experience = c.errors.experience;
    if (!formData.frequency || formData.frequency < 3 || formData.frequency > 7)
      errs.frequency = c.errors.frequency;
    return errs;
  }

  function onNext() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    router.push('/create/preferences');
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8 gap-6">
        <StepStrip current={2} total={3} />

        <View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{c.step2Title}</Text>
          <Text className="text-sm text-slate-400 mt-1">{c.step2Progress}</Text>
        </View>

        <View>
          <Text className="text-sm font-semibold text-ink-700 dark:text-slate-300 mb-2">{c.goal}</Text>
          {goalOptions.map((opt) => {
            const active = formData.fitnessGoal === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => update({ fitnessGoal: opt.value })}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={opt.label}
                className={`flex-row items-center gap-3 p-4 rounded-[14px] border-2 mb-2
                  ${active ? 'border-accent bg-accent-wash' : 'border-line bg-paper dark:bg-slate-800 dark:border-slate-600'}`}
              >
                <View className={`w-10 h-10 rounded-[10px] items-center justify-center ${active ? 'bg-accent/20' : 'bg-canvas dark:bg-slate-700'}`}>
                  <Text className="text-lg">{GOAL_ICONS[opt.value]}</Text>
                </View>
                <Text className={`flex-1 text-sm font-semibold ${active ? 'text-ink-900' : 'text-ink-700 dark:text-slate-200'}`}>
                  {opt.label}
                </Text>
                <View className={`w-4 h-4 rounded-full border-2 ${active ? 'border-accent bg-accent' : 'border-line bg-paper'}`} />
              </Pressable>
            );
          })}
          {errors.fitnessGoal && <Text className="text-xs text-red-500 mt-1">{errors.fitnessGoal}</Text>}
        </View>

        <View>
          <Text className="text-sm font-semibold text-ink-700 dark:text-slate-300 mb-2">{c.experience}</Text>
          {experienceOptions.map((opt) => {
            const active = formData.experience === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => update({ experience: opt.value })}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={opt.label}
                className={`flex-row items-center gap-3 p-4 rounded-[14px] border-2 mb-2
                  ${active ? 'border-accent bg-accent-wash' : 'border-line bg-paper dark:bg-slate-800 dark:border-slate-600'}`}
              >
                <View className={`w-10 h-10 rounded-[10px] items-center justify-center ${active ? 'bg-accent/20' : 'bg-canvas dark:bg-slate-700'}`}>
                  <Text className="text-lg">{EXP_ICONS[opt.value]}</Text>
                </View>
                <Text className={`flex-1 text-sm font-semibold ${active ? 'text-ink-900' : 'text-ink-700 dark:text-slate-200'}`}>
                  {opt.label}
                </Text>
                <View className={`w-4 h-4 rounded-full border-2 ${active ? 'border-accent bg-accent' : 'border-line bg-paper'}`} />
              </Pressable>
            );
          })}
          {errors.experience && <Text className="text-xs text-red-500 mt-1">{errors.experience}</Text>}
        </View>

        <Toggle
          label={c.frequency}
          options={freqOptions}
          value={formData.frequency}
          onChange={(v) => update({ frequency: v })}
        />

        <View className="flex-row gap-3 mt-2">
          <Button variant="secondary" onPress={() => router.back()} className="flex-1">
            {c.back}
          </Button>
          <Button onPress={onNext} className="flex-1">{c.next}</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
