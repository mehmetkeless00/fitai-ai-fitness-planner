import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCreatePlan } from '../../contexts/createPlanContext';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';

export default function Step1() {
  const router = useRouter();
  const { t } = useLanguage();
  const { formData, update } = useCreatePlan();
  const c = t.create;

  const [errors, setErrors] = useState({});

  const genderOptions = [
    { value: 'male', label: c.male },
    { value: 'female', label: c.female },
  ];

  function validate() {
    const age = parseInt(formData.age);
    const height = parseInt(formData.height);
    const weight = parseInt(formData.weight);
    const errs = {};
    if (!formData.age || isNaN(age) || age < 13 || age > 100) errs.age = c.errors.age;
    if (!formData.gender) errs.gender = c.errors.gender;
    if (!formData.height || isNaN(height) || height < 100 || height > 250) errs.height = c.errors.height;
    if (!formData.weight || isNaN(weight) || weight < 30 || weight > 300) errs.weight = c.errors.weight;
    return errs;
  }

  function onNext() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    router.push('/create/goals');
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8 gap-6">
        <View>
          <Text className="text-2xl font-bold text-slate-900 dark:text-white">{c.step1Title}</Text>
          <Text className="text-sm text-slate-400 mt-1">Step 1 of 3</Text>
        </View>

        <Input
          label={c.age}
          placeholder={c.agePlaceholder}
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(v) => update({ age: v })}
          error={errors.age}
        />

        <Toggle
          label={c.gender}
          options={genderOptions}
          value={formData.gender}
          onChange={(v) => update({ gender: v })}
        />
        {errors.gender && <Text className="text-xs text-red-500 -mt-4">{errors.gender}</Text>}

        <Input
          label={c.height}
          placeholder={c.heightPlaceholder}
          keyboardType="numeric"
          value={formData.height}
          onChangeText={(v) => update({ height: v })}
          error={errors.height}
        />

        <Input
          label={c.weight}
          placeholder={c.weightPlaceholder}
          keyboardType="decimal-pad"
          value={formData.weight}
          onChangeText={(v) => update({ weight: v })}
          error={errors.weight}
        />

        <Button onPress={onNext} className="mt-2">{c.next}</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
