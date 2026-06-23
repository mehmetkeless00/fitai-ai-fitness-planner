import { View, Text, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { translations, listCheckins } from '@fitflow/core';
import WorkoutDay from '../../components/features/WorkoutDay';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';

const REST_FOCUSES = new Set([
  'Active Recovery', 'Active Recovery & Mobility',
  'Rest or Active Recovery', 'Complete Rest',
]);

const WEEK_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function todayDayName() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}

function getThisWeekDates() {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  monday.setHours(0, 0, 0, 0);
  return WEEK_DAY_NAMES.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export default function WorkoutTab() {
  const router = useRouter();
  const { plan, refreshPlan } = usePlan();
  const { t, lang } = useLanguage();
  const isDark = useColorScheme() === 'dark';

  useFocusEffect(useCallback(() => { refreshPlan(); }, [refreshPlan]));

  const maps = (translations[lang] || translations.en).maps;

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900 items-center justify-center">
        <Text className="text-slate-500">{t.workout.noActivePlan}</Text>
      </SafeAreaView>
    );
  }

  const workoutPlan = plan.data?.workoutPlan || [];
  const todayName = todayDayName();
  const todayDay = workoutPlan.find((d) => d.day === todayName);
  const restOfWeek = workoutPlan.filter((d) => d.day !== todayName);

  // Week strip
  const checkins = listCheckins();
  const weekDates = getThisWeekDates();
  const todayDate = new Date().toISOString().slice(0, 10);

  const weekCells = WEEK_DAY_NAMES.map((dayName, i) => {
    const date = weekDates[i];
    const planDay = workoutPlan.find((d) => d.day === dayName);
    const isRest = !planDay || REST_FOCUSES.has(planDay?.focus) || !planDay?.exercises?.length;
    const isToday = date === todayDate;
    const isPast = date < todayDate;
    const isFuture = date > todayDate;
    const checkin = checkins.find((c) => c.date === date);
    const isDone = isPast && !isRest && !!(checkin?.workoutsDone?.length);
    return { dayName, isRest, isToday, isDone, isFuture };
  });

  const totalWorkoutDays = workoutPlan.filter(
    (d) => !REST_FOCUSES.has(d.focus) && d.exercises?.length > 0
  ).length;
  const doneCount = weekCells.filter((c) => c.isDone).length;

  function handleExercisePress(exercise) {
    router.push({ pathname: '/modal/exercise', params: { ex: JSON.stringify(exercise) } });
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        <Text
          className="text-xl font-bold text-ink-900 dark:text-white mb-5"
          accessibilityRole="header"
        >
          {t.tabs.workout}
        </Text>

        {/* Week strip */}
        <View className="flex-row gap-1.5 mb-2">
          {weekCells.map(({ dayName, isRest, isToday, isDone, isFuture }, i) => {
            const label = t.days?.short?.[dayName] || dayName.slice(0, 3);
            let cellBg, borderWidth, borderStyle, borderColor;
            if (isDone) {
              cellBg = '#14C06A'; borderWidth = 0; borderStyle = 'solid'; borderColor = 'transparent';
            } else if (isToday) {
              cellBg = '#15161A'; borderWidth = 0; borderStyle = 'solid'; borderColor = 'transparent';
            } else if (isRest) {
              cellBg = isDark ? '#1e293b' : '#F0EFEA'; borderWidth = 0; borderStyle = 'solid'; borderColor = 'transparent';
            } else if (isFuture) {
              cellBg = 'transparent'; borderWidth = 1.5; borderStyle = 'solid'; borderColor = isDark ? '#334155' : '#C5C4BE';
            } else {
              // past missed
              cellBg = 'transparent'; borderWidth = 1; borderStyle = 'dashed'; borderColor = isDark ? '#334155' : '#D9D8D2';
            }

            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', gap: 5 }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: isToday ? '700' : '600',
                  color: isToday ? (isDark ? '#fff' : '#15161A') : '#A7A8AD',
                }}>
                  {label}
                </Text>
                <View style={{
                  width: '100%', height: 40, borderRadius: 11,
                  backgroundColor: cellBg,
                  borderWidth,
                  borderStyle,
                  borderColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {isDone && <Ionicons name="checkmark" size={16} color="#062815" />}
                </View>
              </View>
            );
          })}
        </View>

        {/* Done count caption */}
        <Text className="text-xs text-ink-300 dark:text-slate-500 mb-5">
          <Text className="font-bold text-ink-900 dark:text-white">{doneCount}</Text>
          {totalWorkoutDays > 0 ? ` / ${totalWorkoutDays} ` : ' '}
          {t.workout.doneThisWeek}
        </Text>

        {/* Today's workout — pinned at top */}
        {todayDay && (
          <>
            <Text className="text-xs font-semibold text-ink-300 dark:text-slate-500 uppercase tracking-widest mb-2">
              {t.workout.today}
            </Text>
            <WorkoutDay
              day={todayDay}
              t={t.workout}
              maps={maps}
              onExercisePress={handleExercisePress}
              isToday={true}
              defaultOpen={true}
            />
          </>
        )}

        {/* Rest of the week */}
        {restOfWeek.length > 0 && (
          <>
            <Text className="text-xs font-semibold text-ink-300 dark:text-slate-500 uppercase tracking-widest mt-3 mb-2">
              {t.workout.thisWeek}
            </Text>
            {restOfWeek.map((day, i) => (
              <WorkoutDay
                key={i}
                day={day}
                t={t.workout}
                maps={maps}
                onExercisePress={handleExercisePress}
                isToday={false}
                defaultOpen={false}
              />
            ))}
          </>
        )}

        {workoutPlan.length === 0 && (
          <Text className="text-slate-400 text-center">{t.workout.noExercises}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
