import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import {
  generateCoachNarrative,
  translations,
  recommendCalorieAdjustment,
  applyCalorieAdjustment,
  updatePlanData,
} from '@fitflow/core';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Sparkline from '../../components/features/Sparkline';
import CoachCard from '../../components/features/CoachCard';
import { usePlan } from '../../hooks/usePlan';
import { useCheckins } from '../../hooks/useCheckins';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate } from '../../utils/formatDate';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function todayDayName() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}

function CalorieAdjustCard({ plan, checkins, p, onApplied, onDismiss }) {
  const rec = recommendCalorieAdjustment(plan.data, checkins);
  if (rec.status === 'insufficient-data') return null;

  const adjustedDays =
    plan.data.calorieAdjustedAt
      ? Math.round((Date.now() - new Date(plan.data.calorieAdjustedAt)) / 86400000)
      : null;
  const cooldown = adjustedDays !== null && adjustedDays < 7;

  function handleApply() {
    const newData = applyCalorieAdjustment(plan.data, rec.deltaCalories);
    updatePlanData(plan.id, newData);
    onApplied();
  }

  if (cooldown) {
    return (
      <Card>
        <Text className="text-sm font-semibold text-ink-700 dark:text-slate-200 mb-1">{p.adjustTitle}</Text>
        <Text className="text-sm text-ink-500 dark:text-slate-400">
          {p.adjustCooldown.replace('{days}', adjustedDays).replace('{remaining}', 7 - adjustedDays)}
        </Text>
      </Card>
    );
  }

  if (rec.status === 'on-track') {
    return (
      <Card>
        <Text className="text-sm font-semibold text-ink-700 dark:text-slate-200 mb-1">{p.adjustTitle}</Text>
        <Text className="text-sm text-accent dark:text-accent">{p.adjustOnTrack}</Text>
      </Card>
    );
  }

  const directionStr = rec.direction === 'reduce' ? p.adjustReduce : p.adjustIncrease;
  const message = p.adjustSuggest
    .replace('{direction}', directionStr)
    .replace('{delta}', Math.abs(rec.deltaCalories));

  return (
    <Card>
      <Text className="text-sm font-semibold text-ink-700 dark:text-slate-200 mb-2">{p.adjustTitle}</Text>
      <Text className="text-sm text-ink-500 dark:text-slate-300 mb-3">{message}</Text>
      <View className="flex-row gap-2">
        <Button onPress={handleApply} className="flex-1">{p.adjustApply}</Button>
        <Button variant="secondary" onPress={onDismiss} className="flex-1">{p.adjustDismiss}</Button>
      </View>
    </Card>
  );
}

export default function ProgressTab() {
  const { plan, refreshPlan } = usePlan();
  const { checkins, saveCheckin, refresh } = useCheckins();
  const { t, lang, units } = useLanguage();
  const p = t.progress;

  const [weight, setWeight] = useState('');
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [adjustDismissed, setAdjustDismissed] = useState(false);

  useFocusEffect(useCallback(() => {
    refreshPlan();
    refresh();
  }, [refreshPlan, refresh]));

  useEffect(() => {
    const today = checkins.find((c) => c.date === todayStr());
    if (today?.weight != null) {
      const displayVal = units === 'lbs'
        ? String(Math.round((today.weight / 0.453592) * 10) / 10)
        : String(today.weight);
      setWeight(displayVal);
    } else {
      setWeight('');
    }
    setSelectedWorkouts(today?.workoutsDone ?? []);
  }, [checkins, units]);

  const todayExercises =
    plan?.data?.workoutPlan?.find((d) => d.day === todayDayName())?.exercises || [];

  function toggleWorkout(name) {
    setSelectedWorkouts((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  function handleSave() {
    const w = parseFloat(weight);
    const [minW, maxW] = units === 'lbs' ? [44, 1100] : [20, 500];
    if (weight && (isNaN(w) || w < minW || w > maxW)) {
      Alert.alert(p.invalidWeight, units === 'lbs' ? p.invalidWeightMsgLbs : p.invalidWeightMsgKg);
      return;
    }
    const weightKg = weight ? (units === 'lbs' ? w * 0.453592 : w) : null;
    setSaving(true);
    saveCheckin({ date: todayStr(), weight: weightKg, workoutsDone: selectedWorkouts });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  const coachT = (translations[lang] || translations.en).coach;
  const narrative = plan ? generateCoachNarrative(plan.data, checkins, coachT) : null;

  // Previous check-in reference
  const lastCheckin = checkins
    .filter((c) => c.date !== todayStr() && c.weight != null)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  const prevDisplay = lastCheckin
    ? units === 'lbs'
      ? `${Math.round((lastCheckin.weight / 0.453592) * 10) / 10} lbs`
      : `${lastCheckin.weight} kg`
    : null;

  // Weight trend for sparkline header
  const sortedWithWeight = checkins
    .filter((c) => c.weight != null)
    .sort((a, b) => b.date.localeCompare(a.date));
  const latestCheckin = sortedWithWeight[0];
  const fourWeeksAgo = new Date();
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
  const oldCheckin = sortedWithWeight.find((c) => c.date <= fourWeeksAgo.toISOString().slice(0, 10));
  const currentWeightKg = latestCheckin?.weight ?? null;
  const deltaKg = currentWeightKg != null && oldCheckin?.weight != null
    ? currentWeightKg - oldCheckin.weight
    : null;

  function weightToDisplay(kg) {
    if (kg == null) return null;
    const val = units === 'lbs' ? Math.round((kg / 0.453592) * 10) / 10 : kg;
    return { val: String(val), unit: units === 'lbs' ? 'lbs' : 'kg' };
  }
  const currentW = weightToDisplay(currentWeightKg);
  const deltaTrend = deltaKg != null ? {
    up: deltaKg >= 0,
    text: units === 'lbs'
      ? `${deltaKg >= 0 ? '+' : ''}${Math.round((deltaKg / 0.453592) * 10) / 10} lbs`
      : `${deltaKg >= 0 ? '+' : ''}${Math.round(deltaKg * 10) / 10} kg`,
  } : null;

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">
        <Text className="text-xl font-bold text-ink-900 dark:text-white" accessibilityRole="header">
          {t.tabs.progress}
        </Text>

        {/* Check-in form */}
        <Card>
          <Text className="font-semibold text-ink-900 dark:text-white mb-3">{p.todayCheckin}</Text>
          <Input
            label={units === 'lbs' ? p.weightLabelLbs : p.weightLabel}
            placeholder={units === 'lbs' ? p.weightPlaceholderLbs : p.weightPlaceholder}
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
            accessibilityLabel={units === 'lbs' ? p.weightLabelLbs : p.weightLabel}
          />
          {prevDisplay && (
            <Text className="text-xs text-ink-300 dark:text-slate-500 mt-1.5">
              {p.previous}: {prevDisplay} · {formatDate(lastCheckin.date, lang)}
            </Text>
          )}
          {todayExercises.length > 0 && (
            <View className="mt-4 gap-2">
              <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{p.workoutsDone}</Text>
              {todayExercises.map((ex) => {
                const checked = selectedWorkouts.includes(ex.name);
                return (
                  <Pressable
                    key={ex.name}
                    onPress={() => toggleWorkout(ex.name)}
                    className="flex-row items-center gap-3 py-1"
                    style={{ minHeight: 44 }}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked }}
                    accessibilityLabel={ex.name}
                  >
                    <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
                      checked ? 'bg-accent border-accent' : 'border-line dark:border-slate-600'
                    }`}>
                      {checked && <Text className="text-[#062815] text-xs font-bold">✓</Text>}
                    </View>
                    <Text className="text-sm text-ink-700 dark:text-slate-300">{ex.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
          <Button onPress={handleSave} loading={saving} className="mt-4" accessibilityLabel={p.save}>
            {justSaved ? p.saved : p.save}
          </Button>
        </Card>

        {/* Smart Coach — above sparkline */}
        {narrative && (
          <Card>
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 rounded-lg bg-accent-wash items-center justify-center">
                <Ionicons name="disc-outline" size={18} color="#0E8A4C" />
              </View>
              <Text className="font-semibold text-ink-900 dark:text-white">{p.coachTitle}</Text>
            </View>
            <CoachCard narrative={narrative} />
          </Card>
        )}

        {/* Weight sparkline — empty state when no check-ins yet */}
        {checkins.length === 0 && (
          <Card>
            <Text
              className="text-ink-300 dark:text-slate-500 mb-3"
              style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}
            >
              {p.trendTitle}
            </Text>
            <View className="items-center gap-2 py-3">
              <Ionicons name="scale-outline" size={26} color="#A7A8AD" />
              <Text className="text-sm text-ink-300 dark:text-slate-500 text-center">{p.trendEmpty}</Text>
            </View>
          </Card>
        )}

        {/* Weight sparkline with trend header */}
        {checkins.length > 0 && (
          <Card>
            <View className="flex-row items-end justify-between mb-3">
              <View>
                <Text
                  className="text-ink-300 dark:text-slate-500 mb-1"
                  style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}
                >
                  {p.trendTitle}
                </Text>
                {currentW && (
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-3xl font-bold text-ink-900 dark:text-white" style={{ letterSpacing: -0.5 }}>
                      {currentW.val}
                    </Text>
                    <Text className="text-sm text-ink-300">{currentW.unit}</Text>
                  </View>
                )}
              </View>
              {deltaTrend && (
                <View style={{
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                  paddingHorizontal: 10, paddingVertical: 5,
                  borderRadius: 999, backgroundColor: '#E8F8EF',
                }}>
                  <Ionicons name={deltaTrend.up ? 'arrow-up' : 'arrow-down'} size={12} color="#0E8A4C" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#0E8A4C' }}>
                    {deltaTrend.text} · 4 {p.weekAbbr}
                  </Text>
                </View>
              )}
            </View>
            <Sparkline checkins={checkins} hint={p.trendHint} />
          </Card>
        )}

        {/* Adaptive calorie adjustment */}
        {plan && !adjustDismissed && (
          <CalorieAdjustCard
            plan={plan}
            checkins={checkins}
            p={p}
            onApplied={refreshPlan}
            onDismiss={() => setAdjustDismissed(true)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
