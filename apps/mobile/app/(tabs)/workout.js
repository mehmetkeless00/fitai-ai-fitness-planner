import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { translations } from '@fitflow/core';
import WorkoutDay from '../../components/features/WorkoutDay';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';

function todayDayName() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}

export default function WorkoutTab() {
  const router = useRouter();
  const { plan, refreshPlan } = usePlan();
  const { t, lang } = useLanguage();

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

  function handleExercisePress(exercise) {
    router.push({ pathname: '/modal/exercise', params: { ex: JSON.stringify(exercise) } });
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
        <Text
          className="text-xl font-bold text-slate-900 dark:text-white mb-5"
          accessibilityRole="header"
        >
          {t.tabs.workout}
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
