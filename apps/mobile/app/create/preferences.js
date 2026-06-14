import { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { generateSmartPlan, savePlan, setActivePlan } from '@fitflow/core';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCreatePlan } from './context';
import Toggle from '../../components/ui/Toggle';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

    const autoName = `${profile.fitnessGoal} — ${new Date().toLocaleDateString()}`;
    const id = savePlan(merged, autoName);
    setActivePlan(id);

    setLoading(false);
    router.replace('/(tabs)/overview');
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8 gap-6">
        <View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{c.step3Title}</Text>
          <Text className="text-sm text-slate-400 mt-1">Step 3 of 3</Text>
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
