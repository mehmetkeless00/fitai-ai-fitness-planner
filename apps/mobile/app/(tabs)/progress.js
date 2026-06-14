import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { generateCoachNarrative, translations } from '@fitflow/core';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Sparkline from '../../components/features/Sparkline';
import CoachCard from '../../components/features/CoachCard';
import { usePlan } from '../../hooks/usePlan';
import { useCheckins } from '../../hooks/useCheckins';
import { useLanguage } from '../../i18n/LanguageContext';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function todayDayName() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}

export default function ProgressTab() {
  const { plan, refreshPlan } = usePlan();
  const { checkins, saveCheckin, refresh } = useCheckins();
  const { t, lang } = useLanguage();
  const p = t.progress;

  const [weight, setWeight] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // Refresh data when tab is focused
  useFocusEffect(useCallback(() => {
    refreshPlan();
    refresh();
  }, [refreshPlan, refresh]));

  // Sync form fields with today's saved check-in whenever checkins change
  useEffect(() => {
    const today = checkins.find((c) => c.date === todayStr());
    setWeight(today?.weight != null ? String(today.weight) : '');
    setSelectedWorkouts(today?.workoutsDone ?? []);
  }, [checkins]);

  const todayExercises = plan?.data?.workoutPlan?.find((d) => d.day === todayDayName())?.exercises || [];

  function toggleWorkout(name) {
    setSelectedWorkouts((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  function handleSave() {
    const w = parseFloat(weight);
    if (weight && (isNaN(w) || w < 20 || w > 500)) {
      Alert.alert('Invalid weight', 'Enter a realistic weight in kg.');
      return;
    }
    setSaving(true);
    saveCheckin({
      date: todayStr(),
      weight: weight ? w : null,
      workoutsDone: selectedWorkouts,
    });
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  const coachT = (translations[lang] || translations.en).coach;
  const narrative = plan ? generateCoachNarrative(plan.data, checkins, coachT) : null;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">
        <Text className="text-xl font-bold text-slate-900 dark:text-white">{t.tabs.progress}</Text>

        {/* Check-in form */}
        <Card>
          <Text className="font-semibold text-slate-800 dark:text-white mb-3">{p.todayCheckin}</Text>

          <Input
            label={p.weightLabel}
            placeholder={p.weightPlaceholder}
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
          />

          {todayExercises.length > 0 && (
            <View className="mt-4 gap-2">
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.workoutsDone}</Text>
              {todayExercises.map((ex) => {
                const checked = selectedWorkouts.includes(ex.name);
                return (
                  <Pressable
                    key={ex.name}
                    onPress={() => toggleWorkout(ex.name)}
                    className="flex-row items-center gap-3 py-1"
                  >
                    <View
                      className={`w-5 h-5 rounded border-2 items-center justify-center ${
                        checked ? 'bg-sky-500 border-sky-500' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {checked && <Text className="text-white text-xs font-bold">✓</Text>}
                    </View>
                    <Text className="text-sm text-slate-700 dark:text-slate-300">{ex.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Button onPress={handleSave} loading={saving} className="mt-4">
            {justSaved ? p.saved : p.save}
          </Button>
        </Card>

        {/* Weight sparkline */}
        {checkins.length > 0 && (
          <Card>
            <Text className="font-semibold text-slate-800 dark:text-white mb-3">{p.trendTitle}</Text>
            <Sparkline checkins={checkins} />
          </Card>
        )}

        {/* Smart Coach */}
        {narrative && (
          <Card>
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 rounded-lg bg-sky-500 items-center justify-center">
                <Text className="text-white text-base">🎯</Text>
              </View>
              <Text className="font-semibold text-slate-800 dark:text-white">{p.coachTitle}</Text>
            </View>
            <CoachCard narrative={narrative} />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
