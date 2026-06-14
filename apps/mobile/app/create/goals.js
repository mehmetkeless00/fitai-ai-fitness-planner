import { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCreatePlan } from './context';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';

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
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8 gap-6">
        <View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{c.step2Title}</Text>
          <Text className="text-sm text-slate-400 mt-1">Step 2 of 3</Text>
        </View>

        <Toggle
          label={c.goal}
          options={goalOptions}
          value={formData.fitnessGoal}
          onChange={(v) => update({ fitnessGoal: v })}
        />
        {errors.fitnessGoal && <Text className="text-xs text-red-500 -mt-4">{errors.fitnessGoal}</Text>}

        <Toggle
          label={c.experience}
          options={experienceOptions}
          value={formData.experience}
          onChange={(v) => update({ experience: v })}
        />
        {errors.experience && <Text className="text-xs text-red-500 -mt-4">{errors.experience}</Text>}

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
