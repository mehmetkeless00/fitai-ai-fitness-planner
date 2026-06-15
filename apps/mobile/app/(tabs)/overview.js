import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import Card from '../../components/ui/Card';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';
import { blendRecoveryScore, listCheckins, translations } from '@fitflow/core';
import { formatDate } from '../../utils/formatDate';
import { sharePlan } from '../../utils/sharePlan';

function StatCard({ label, value, unit, color }) {
  return (
    <Card className="flex-1">
      <Text className={`text-2xl font-bold ${color}`} accessibilityLabel={`${label}: ${value} ${unit}`}>
        {value}
      </Text>
      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{unit}</Text>
      <Text className="text-sm text-slate-600 dark:text-slate-300 mt-1">{label}</Text>
    </Card>
  );
}

function MacroBar({ protein, carbs, fat, labels }) {
  const total = (protein?.percentage || 0) + (carbs?.percentage || 0) + (fat?.percentage || 0);
  if (total === 0) return null;
  const pPct = protein?.percentage || 0;
  const cPct = carbs?.percentage || 0;
  const fPct = fat?.percentage || 0;

  return (
    <View className="mt-3">
      <View
        className="flex-row rounded-full overflow-hidden h-3"
        accessibilityLabel={`${labels.protein} ${pPct}%, ${labels.carbs} ${cPct}%, ${labels.fat} ${fPct}%`}
      >
        <View style={{ flex: pPct }} className="bg-emerald-500" />
        <View style={{ flex: cPct }} className="bg-amber-400" />
        <View style={{ flex: fPct }} className="bg-rose-400" />
      </View>
      <View className="flex-row justify-between mt-1.5">
        <Text className="text-xs text-emerald-600 dark:text-emerald-400">{labels.protein} {pPct}%</Text>
        <Text className="text-xs text-amber-600 dark:text-amber-400">{labels.carbs} {cPct}%</Text>
        <Text className="text-xs text-rose-500 dark:text-rose-400">{labels.fat} {fPct}%</Text>
      </View>
    </View>
  );
}

function RecoveryCard({ score, t }) {
  const color =
    score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-rose-600';
  const barColor =
    score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-400' : 'bg-rose-400';

  return (
    <Card>
      <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {t.recoveryTitle}
      </Text>
      <View className="flex-row items-center gap-3">
        <Text
          className={`text-3xl font-bold ${color}`}
          accessibilityLabel={`${t.recoveryTitle}: ${score}`}
        >
          {score}
        </Text>
        <View className="flex-1">
          <View className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <View className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
          </View>
          <Text className="text-xs text-slate-400 mt-1">{t.recoveryDesc}</Text>
        </View>
      </View>
    </Card>
  );
}

// Parse "2.6-3.1 liters per day (more on workout days)" → localized equivalent
function formatHydration(hydration, lang) {
  if (typeof hydration === 'string') {
    const match = hydration.match(/^([\d.]+-[\d.]+)/);
    if (match) {
      const suffix = (translations[lang] || translations.en).maps.hydrationSuffix;
      return `${match[1]} ${suffix}`;
    }
    return hydration;
  }
  if (typeof hydration === 'object' && hydration !== null) {
    return hydration.dailyAmount || JSON.stringify(hydration);
  }
  return String(hydration ?? '');
}

export default function OverviewTab() {
  const { plan, refreshPlan } = usePlan();
  const { t, lang } = useLanguage();
  const o = t.overview;
  const [sharing, setSharing] = useState(false);

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
  const planLang = data?.lang || lang;

  const checkins = listCheckins();
  const recoveryScore =
    data?.recoveryScore != null
      ? Math.round(blendRecoveryScore(data.recoveryScore, checkins, data.workoutPlan))
      : null;

  // Disclaimer from core translations in the plan's language
  const disclaimer = (translations[planLang] || translations.en).result.disclaimer;

  async function handleShare() {
    setSharing(true);
    try {
      await sharePlan(plan, planLang);
    } catch {
      Alert.alert('', o.shareError);
    } finally {
      setSharing(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">
        {/* Plan header + share button */}
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text
              className="text-xl font-bold text-slate-900 dark:text-white"
              numberOfLines={2}
              accessibilityRole="header"
            >
              {plan.name}
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">
              {o.createdOn} {formatDate(plan.createdAt, lang)}
            </Text>
          </View>
          <Pressable
            onPress={handleShare}
            disabled={sharing}
            className="bg-sky-500 active:bg-sky-600 px-3 py-2 rounded-xl items-center"
            accessibilityRole="button"
            accessibilityLabel={o.sharePlan}
          >
            <Text className="text-white text-xs font-semibold">
              {sharing ? '…' : '📤'}
            </Text>
            <Text className="text-white text-xs mt-0.5">{o.sharePlan}</Text>
          </Pressable>
        </View>

        {/* Calorie + macro stat cards */}
        <View className="flex-row gap-3">
          <StatCard label={o.calories} value={data?.dailyCalories ?? '—'} unit={o.perDay} color="text-sky-600" />
          <StatCard label={o.protein} value={macros?.protein?.grams ?? '—'} unit={o.grams} color="text-emerald-600" />
        </View>
        <View className="flex-row gap-3">
          <StatCard label={o.carbs} value={macros?.carbs?.grams ?? '—'} unit={o.grams} color="text-amber-600" />
          <StatCard label={o.fat} value={macros?.fat?.grams ?? '—'} unit={o.grams} color="text-rose-600" />
        </View>

        {/* Macro percentage breakdown bar */}
        {(macros.protein || macros.carbs || macros.fat) && (
          <Card>
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-0">
              {o.macroBreakdown}
            </Text>
            <MacroBar
              protein={macros.protein}
              carbs={macros.carbs}
              fat={macros.fat}
              labels={{ protein: o.protein, carbs: o.carbs, fat: o.fat }}
            />
          </Card>
        )}

        {/* Recovery score */}
        {recoveryScore != null && <RecoveryCard score={recoveryScore} t={o} />}

        {/* Hydration */}
        {data?.hydration && (
          <Card>
            <Text className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              {o.hydration}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {formatHydration(data.hydration, planLang)}
            </Text>
          </Card>
        )}

        {disclaimer && (
          <Text className="text-xs text-slate-400 italic text-center px-2">
            {disclaimer}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
