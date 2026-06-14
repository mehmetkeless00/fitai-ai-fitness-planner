import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Card from '../../components/ui/Card';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';

function StatCard({ label, value, unit, color }) {
  return (
    <Card className="flex-1">
      <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{unit}</Text>
      <Text className="text-sm text-slate-600 dark:text-slate-300 mt-1">{label}</Text>
    </Card>
  );
}

export default function OverviewTab() {
  const { plan, refreshPlan } = usePlan();
  const { t } = useLanguage();
  const o = t.overview;

  useFocusEffect(useCallback(() => { refreshPlan(); }, [refreshPlan]));

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 items-center justify-center">
        <Text className="text-slate-500">No active plan.</Text>
      </SafeAreaView>
    );
  }

  const { data } = plan;
  const macros = data?.macros || {};

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">
        <View className="gap-1">
          <Text className="text-xl font-bold text-slate-900 dark:text-white" numberOfLines={2}>
            {plan.name}
          </Text>
          <Text className="text-xs text-slate-400">
            {o.createdOn} {new Date(plan.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View className="flex-row gap-3">
          <StatCard
            label={o.calories}
            value={data?.dailyCalories ?? '—'}
            unit={o.perDay}
            color="text-sky-600"
          />
          <StatCard
            label={o.protein}
            value={macros?.protein?.grams ?? '—'}
            unit={o.grams}
            color="text-emerald-600"
          />
        </View>

        <View className="flex-row gap-3">
          <StatCard
            label={o.carbs}
            value={macros?.carbs?.grams ?? '—'}
            unit={o.grams}
            color="text-amber-600"
          />
          <StatCard
            label={o.fat}
            value={macros?.fat?.grams ?? '—'}
            unit={o.grams}
            color="text-rose-600"
          />
        </View>

        {data?.hydration && (
          <Card>
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Hydration
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {typeof data.hydration === 'object' ? data.hydration.dailyAmount || JSON.stringify(data.hydration) : data.hydration}
            </Text>
          </Card>
        )}

        {data?._metadata?.disclaimer && (
          <Text className="text-xs text-slate-400 italic text-center px-2">
            {data._metadata.disclaimer}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
