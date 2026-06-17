import { useState } from 'react';
import { View, Text, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { generateSmartPlan, savePlan, setActivePlan } from '@fitflow/core';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCreatePlan } from '../../contexts/createPlanContext';
import { formatDate } from '../../utils/formatDate';
import Toggle from '../../components/ui/Toggle';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import StepStrip from '../../components/ui/StepStrip';

export default function Step3() {
  const router = useRouter();
  const { t, lang: uiLang, setLang } = useLanguage();
  const { formData, update } = useCreatePlan();
  const c = t.create;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dietOptions = [
    { value: 'omnivore', label: c.omnivore },
    { value: 'vegetarian', label: c.vegetarian },
    { value: 'vegan', label: c.vegan },
    { value: 'gluten-free', label: c.glutenFree },
    { value: 'keto', label: c.keto },
  ];

  const langOptions = [
    { value: 'en', label: c.english },
    { value: 'tr', label: c.turkish },
  ];

  function validate() {
    const errs = {};
    if (!formData.dietaryPreference) errs.diet = c.errors.diet;
    return errs;
  }

  async function onGenerate() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const planLang = formData.lang || 'en';
    if (planLang !== uiLang) setLang(planLang);

    const profile = {
      age: parseInt(formData.age),
      gender: formData.gender,
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      fitnessGoal: formData.fitnessGoal,
      experience: formData.experience,
      frequency: parseInt(formData.frequency),
      dietaryPreference: formData.dietaryPreference,
      allergies: formData.allergies || '',
      lang: planLang,
    };

    const plan = generateSmartPlan(profile);
    const merged = { ...profile, ...plan, generatedAt: new Date().toISOString() };

    const goalLabels = {
      'lose-weight': c.loseWeight,
      'build-muscle': c.buildMuscle,
      maintenance: c.maintain,
    };
    const goalStr = goalLabels[profile.fitnessGoal] || profile.fitnessGoal;
    const autoName = `${goalStr} — ${formatDate(new Date().toISOString(), uiLang)}`;
    const id = savePlan(merged, autoName);
    setActivePlan(id);

    setLoading(false);
    router.replace('/(tabs)/overview');
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      {/* Full-screen generating overlay */}
      <Modal visible={loading} transparent animationType="fade">
        <View className="flex-1 bg-white dark:bg-slate-900 items-center justify-center px-8 gap-6">
          <ActivityIndicator size="large" color="#14C06A" />
          <Text className="text-lg font-semibold text-slate-900 dark:text-white text-center">
            {c.generating}
          </Text>
          <Text className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">
            {c.generatingDetail}
          </Text>
        </View>
      </Modal>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8 gap-6">
        <StepStrip current={3} total={3} />
        <View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{c.step3Title}</Text>
          <Text className="text-sm text-slate-400 mt-1">{c.step3Progress}</Text>
        </View>

        <Toggle
          label={c.diet}
          options={dietOptions}
          value={formData.dietaryPreference}
          onChange={(v) => update({ dietaryPreference: v })}
        />
        {errors.diet && <Text className="text-xs text-red-500 -mt-4">{errors.diet}</Text>}

        <Input
          label={c.allergies}
          placeholder={c.allergiesPlaceholder}
          value={formData.allergies}
          onChangeText={(v) => update({ allergies: v })}
        />

        <Toggle
          label={c.language}
          options={langOptions}
          value={formData.lang}
          onChange={(v) => update({ lang: v })}
        />

        <View className="flex-row gap-3 mt-2">
          <Button variant="secondary" onPress={() => router.back()} className="flex-1">
            {c.back}
          </Button>
          <Button onPress={onGenerate} loading={loading} className="flex-1">
            {loading ? c.generating : c.generate}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
