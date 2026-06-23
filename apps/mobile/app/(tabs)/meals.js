import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import MealRow from '../../components/features/MealRow';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';
import { translateMealPlan } from '@fitflow/core';

function sumMacros(day) {
  const slots = ['breakfast', 'lunch', 'dinner', 'snack'];
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  for (const slot of slots) {
    const meal = day?.meals?.[slot];
    if (!meal) continue;
    calories += meal.calories || 0;
    protein  += meal.macros?.protein || 0;
    carbs    += meal.macros?.carbs   || 0;
    fat      += meal.macros?.fat     || 0;
  }
  return { calories, protein, carbs, fat };
}

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
          <View className="w-16 h-16 rounded-[20px] bg-paper dark:bg-slate-800 border border-line dark:border-slate-700 items-center justify-center">
            <Ionicons name="restaurant-outline" size={28} color="#A7A8AD" />
          </View>
          <Text className="text-base font-semibold text-ink-900 dark:text-white text-center">
            {t.meals.noActivePlan}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const mealPlan = (translateMealPlan(plan.data, lang) || plan.data)?.mealPlan || [];
  const shortDays = t.days?.short || {};

  const dayNames = mealPlan.map((d, i) => {
    if (d.day && shortDays[d.day]) return shortDays[d.day];
    return d.day?.slice(0, 3) || `D${i + 1}`;
  });

  const currentDay = mealPlan[dayIndex];
  const totals = sumMacros(currentDay);

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-xl font-bold text-ink-900 dark:text-white mb-3" accessibilityRole="header">
          {t.tabs.meals}
        </Text>

        {/* Day chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {dayNames.map((name, i) => (
              <Pressable
                key={i}
                onPress={() => setDayIndex(i)}
                className={`px-3 py-2.5 rounded-full border ${
                  i === dayIndex
                    ? 'bg-accent border-accent'
                    : 'bg-paper dark:bg-slate-800 border-line dark:border-slate-600'
                }`}
                accessibilityRole="tab"
                accessibilityState={{ selected: i === dayIndex }}
                accessibilityLabel={mealPlan[i]?.day || name}
              >
                <Text className={`text-xs font-medium ${
                  i === dayIndex ? 'text-[#062815]' : 'text-ink-500 dark:text-slate-300'
                }`}>
                  {name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-4 pt-2 pb-6">
        {currentDay ? (
          <>
            {/* Dark day-total summary bar */}
            {totals.calories > 0 && (
              <View
                style={{ backgroundColor: '#15161A', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 16, marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)', marginBottom: 3 }}>
                      {dayNames[dayIndex]} · {t.meals.dayTotal}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                      <Text style={{ fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: '#F6F5F2' }}>
                        {totals.calories}
                      </Text>
                      <Text style={{ fontSize: 13, color: 'rgba(246,245,242,0.5)' }}>kcal</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    {[
                      { value: totals.protein, color: '#3FE08C', label: 'P' },
                      { value: totals.carbs,   color: '#F5A524', label: 'C' },
                      { value: totals.fat,     color: '#7C8CFF', label: 'F' },
                    ].map((m) => (
                      <View key={m.label} style={{ alignItems: 'center' }}>
                        <Text style={{ fontWeight: '700', fontSize: 15, color: m.color }}>
                          {Math.round(m.value)}
                        </Text>
                        <Text style={{ fontSize: 10.5, color: 'rgba(246,245,242,0.5)', marginTop: 1 }}>
                          {m.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {['breakfast', 'lunch', 'dinner', 'snack'].map((slot) => (
              <MealRow key={slot} slot={slot} meal={currentDay.meals?.[slot]} t={t} />
            ))}
          </>
        ) : (
          <Text className="text-ink-300 text-center mt-8">{t.meals.noMealData}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
