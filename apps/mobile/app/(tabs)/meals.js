import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import MealRow from '../../components/features/MealRow';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';
import { translateMealPlan } from '@fitflow/core';

export default function MealsTab() {
  const { plan, refreshPlan } = usePlan();
  const { t, lang } = useLanguage();
  const [dayIndex, setDayIndex] = useState(0);

  useFocusEffect(useCallback(() => {
    refreshPlan();
    const today = new Date().getDay();
    setDayIndex(today === 0 ? 6 : today - 1);
  }, [refreshPlan]));

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900 items-center justify-center px-8">
        <View className="items-center gap-3">
          <Text style={{ fontSize: 40 }}>🥗</Text>
          <Text className="text-base font-semibold text-ink-900 dark:text-white text-center">
            {t.meals.noActivePlan}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const mealPlan = (translateMealPlan(plan.data, lang) || plan.data)?.mealPlan || [];
  const shortDays = t.days?.short || {};

  // Translate the day name; fallback to first 3 chars of whatever is stored
  const dayNames = mealPlan.map((d, i) => {
    if (d.day && shortDays[d.day]) return shortDays[d.day];
    return d.day?.slice(0, 3) || `D${i + 1}`;
  });

  const currentDay = mealPlan[dayIndex];

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-xl font-bold text-ink-900 dark:text-white mb-3" accessibilityRole="header">
          {t.tabs.meals}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {dayNames.map((name, i) => (
              <Pressable
                key={i}
                onPress={() => setDayIndex(i)}
                className={`px-3 py-1.5 rounded-full border ${
                  i === dayIndex
                    ? 'bg-accent border-accent'
                    : 'bg-paper dark:bg-slate-800 border-line dark:border-slate-600'
                }`}
                accessibilityRole="tab"
                accessibilityState={{ selected: i === dayIndex }}
                accessibilityLabel={mealPlan[i]?.day || name}
              >
                <Text className={`text-xs font-medium ${i === dayIndex ? 'text-[#062815]' : 'text-ink-500 dark:text-slate-300'}`}>
                  {name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-6">
        {currentDay ? (
          ['breakfast', 'lunch', 'dinner', 'snack'].map((slot) => (
            <MealRow key={slot} slot={slot} meal={currentDay.meals?.[slot]} t={t} />
          ))
        ) : (
          <Text className="text-ink-300 text-center mt-8">{t.meals.noMealData}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
