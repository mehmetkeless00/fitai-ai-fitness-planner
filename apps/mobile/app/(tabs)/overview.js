import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { blendRecoveryScore, translations, listCheckins } from '@fitflow/core';
import Card from '../../components/ui/Card';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate } from '../../utils/formatDate';
import { sharePlan } from '../../utils/sharePlan';

const REST_FOCUSES = new Set([
  'Active Recovery', 'Active Recovery & Mobility',
  'Rest or Active Recovery', 'Complete Rest',
]);

function todayDayName() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
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

function MacroRings({ proteinPct, fatPct }) {
  const size = 118;
  const cx = 59, cy = 59;
  const outerR = 50, innerR = 36;
  const outerCirc = 2 * Math.PI * outerR;
  const innerCirc = 2 * Math.PI * innerR;
  const clamp = (v) => Math.min(Math.max(v, 0), 1);
  return (
    <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
      <Circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(20,192,106,0.18)" strokeWidth={9} />
      <Circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(124,140,255,0.18)" strokeWidth={9} />
      <Circle
        cx={cx} cy={cy} r={outerR} fill="none" stroke="#14C06A" strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={outerCirc}
        strokeDashoffset={outerCirc * (1 - clamp(proteinPct))}
      />
      <Circle
        cx={cx} cy={cy} r={innerR} fill="none" stroke="#7C8CFF" strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={innerCirc}
        strokeDashoffset={innerCirc * (1 - clamp(fatPct))}
      />
    </Svg>
  );
}

function RecoveryCard({ score, t }) {
  const color = score >= 60 ? 'text-accent' : score >= 40 ? 'text-[#F5A524]' : 'text-semantic-danger';
  const barColor = score >= 60 ? 'bg-accent' : score >= 40 ? 'bg-[#F5A524]' : 'bg-semantic-danger';
  return (
    <Card>
      <Text className="text-sm font-semibold text-ink-700 dark:text-slate-200 mb-2">{t.recoveryTitle}</Text>
      <View className="flex-row items-center gap-3">
        <View className="flex-row items-baseline gap-0.5">
          <Text className={`text-3xl font-bold ${color}`} accessibilityLabel={`${t.recoveryTitle}: ${score}`}>
            {score}
          </Text>
          <Text className="text-xs text-ink-300 dark:text-slate-500">/ 100</Text>
        </View>
        <View className="flex-1">
          <View className="h-2 bg-line dark:bg-slate-700 rounded-full overflow-hidden">
            <View className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
          </View>
          <Text className="text-xs text-ink-300 mt-1">{t.recoveryDesc}</Text>
        </View>
      </View>
    </Card>
  );
}

export default function OverviewTab() {
  const router = useRouter();
  const { plan, refreshPlan } = usePlan();
  const { t, lang } = useLanguage();
  const o = t.overview;
  const [sharing, setSharing] = useState(false);

  useFocusEffect(useCallback(() => { refreshPlan(); }, [refreshPlan]));

  if (!plan) {
    return (
      <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900 items-center justify-center px-8">
        <View className="items-center gap-3">
          <View className="w-16 h-16 rounded-[20px] bg-paper dark:bg-slate-800 border border-line dark:border-slate-700 items-center justify-center">
            <Ionicons name="stats-chart-outline" size={28} color="#A7A8AD" />
          </View>
          <Text className="text-base font-semibold text-ink-900 dark:text-white text-center">{o.noActivePlan}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { data } = plan;
  const macros = data?.macros || {};
  const dailyCalories = data?.dailyCalories || 0;

  const checkins = listCheckins();
  let recoveryScore = null;
  if (data?.recoveryScore != null) {
    try {
      recoveryScore = Math.round(blendRecoveryScore(data.recoveryScore, checkins, data.workoutPlan));
    } catch {}
  }

  const disclaimer = (translations[lang] || translations.en).result.disclaimer;

  // Macro kcal fractions for rings + mini-bars
  const proteinKcal = (macros.protein?.grams || 0) * 4;
  const carbsKcal   = (macros.carbs?.grams   || 0) * 4;
  const fatKcal     = (macros.fat?.grams     || 0) * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || Math.max(dailyCalories, 1);
  const proteinPct = proteinKcal / totalMacroKcal;
  const carbsPct   = carbsKcal   / totalMacroKcal;
  const fatPct     = fatKcal     / totalMacroKcal;

  const macroRows = [
    { key: 'protein', label: o.protein, grams: macros.protein?.grams, pct: proteinPct, color: '#14C06A' },
    { key: 'carbs',   label: o.carbs,   grams: macros.carbs?.grams,   pct: carbsPct,   color: '#F5A524' },
    { key: 'fat',     label: o.fat,     grams: macros.fat?.grams,     pct: fatPct,     color: '#7C8CFF' },
  ].filter((m) => m.grams != null);

  // Today's workout preview
  const workoutPlan = data?.workoutPlan || [];
  const todayDay = workoutPlan.find((d) => d.day === todayDayName());
  const isRestDay = !todayDay || REST_FOCUSES.has(todayDay?.focus) || !todayDay?.exercises?.length;
  const todayExercises = todayDay?.exercises || [];
  const maps = (translations[lang] || translations.en).maps;
  const focusLabel = todayDay ? (maps?.workoutFocus?.[todayDay.focus] || todayDay.focus) : null;

  const initial = (plan.name || '?').charAt(0).toUpperCase();
  // Strip auto-generated date suffix (e.g. "Goal — 21.06.2026") for cleaner header display
  const displayName = plan.name?.replace(/\s*[—–]\s*\d{2}[./]\d{2}[./]\d{4}$/, '').trim() || plan.name;

  async function handleShare() {
    setSharing(true);
    try {
      await sharePlan(plan, lang);
    } catch {
      Alert.alert('', o.shareError);
    } finally {
      setSharing(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-4 py-6 gap-4">

        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-xs font-semibold text-ink-300 dark:text-slate-500 uppercase tracking-widest">
              {t.days?.short?.[todayDayName()] || ''} · {formatDate(new Date().toISOString().slice(0, 10), lang)}
            </Text>
            <Text
              className="text-xl font-bold text-ink-900 dark:text-white mt-0.5"
              numberOfLines={1}
              accessibilityRole="header"
            >
              {displayName}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={handleShare}
              disabled={sharing}
              className="rounded-full bg-paper dark:bg-slate-800 border border-line dark:border-slate-700 items-center justify-center active:opacity-70"
              style={{ width: 44, height: 44 }}
              accessibilityRole="button"
              accessibilityLabel={o.sharePlan}
            >
              <Ionicons name={sharing ? 'ellipsis-horizontal' : 'share-outline'} size={18} color="#6B6C72" />
            </Pressable>
            <View
              style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#15161A', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: '#F6F5F2', fontWeight: '700', fontSize: 15 }}>{initial}</Text>
            </View>
          </View>
        </View>

        {/* Dark hero card */}
        <View style={{ backgroundColor: '#15161A', borderRadius: 24, padding: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <Text style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(246,245,242,0.45)' }}>
              {o.dailyTarget}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(20,192,106,0.16)' }}>
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: '#3FE08C' }} />
              <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#3FE08C' }}>{t.plans.active}</Text>
            </View>
          </View>

          {/* Ring + macro grams */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
            <View style={{ position: 'relative', width: 118, height: 118, flexShrink: 0 }}>
              <MacroRings proteinPct={proteinPct} fatPct={fatPct} />
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F6F5F2', fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }} numberOfLines={1}>
                  {dailyCalories > 0 ? dailyCalories.toLocaleString() : '—'}
                </Text>
                <Text style={{ color: 'rgba(246,245,242,0.5)', fontSize: 11, marginTop: 2 }}>kcal</Text>
              </View>
            </View>

            <View style={{ flex: 1, gap: 8 }}>
              {macroRows.map((m) => (
                <View key={m.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: m.color }} />
                  <Text style={{ flex: 1, fontSize: 12.5, color: 'rgba(246,245,242,0.6)' }}>{m.label}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#F6F5F2' }}>{m.grams}g</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Macro mini-bars */}
          {macroRows.length > 0 && (
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 18 }}>
              {macroRows.map((m) => (
                <View key={m.key} style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <View style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: m.color }} />
                      <Text style={{ fontSize: 12, color: 'rgba(246,245,242,0.6)' }}>{m.label.charAt(0)}</Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#F6F5F2' }}>{m.grams}g</Text>
                  </View>
                  <View style={{ height: 5, borderRadius: 99, backgroundColor: 'rgba(246,245,242,0.1)', overflow: 'hidden' }}>
                    <View style={{ width: `${Math.round(Math.min(m.pct, 1) * 100)}%`, height: '100%', backgroundColor: m.color, borderRadius: 99 }} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Today's workout preview */}
        {todayDay && !isRestDay && (
          <Card>
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-11 h-11 rounded-[13px] bg-accent-wash items-center justify-center">
                <Ionicons name="barbell-outline" size={20} color="#0E8A4C" />
              </View>
              <View className="flex-1">
                <Text style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: '#A7A8AD' }}>
                  {o.todayWorkout}
                </Text>
                <Text className="font-bold text-ink-900 dark:text-white text-base" numberOfLines={1}>
                  {focusLabel}
                </Text>
              </View>
              <Text className="text-xs text-ink-300">
                {todayExercises.length} {t.workout.exercises}
              </Text>
            </View>

            <View className="gap-2 mb-3">
              {todayExercises.slice(0, 3).map((ex, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-3 bg-canvas dark:bg-slate-700 rounded-[11px] px-3 py-2"
                >
                  <View className="w-6 h-6 rounded-[7px] bg-paper dark:bg-slate-600 items-center justify-center">
                    <Text className="text-xs font-bold text-ink-500 dark:text-slate-300">{i + 1}</Text>
                  </View>
                  <Text className="flex-1 text-sm font-medium text-ink-900 dark:text-white" numberOfLines={1}>
                    {ex.name}
                  </Text>
                  <Text className="text-xs text-ink-300">{ex.sets} × {ex.reps}</Text>
                </View>
              ))}
              {todayExercises.length > 3 && (
                <Text className="text-xs text-ink-300 text-center">
                  +{todayExercises.length - 3} {t.workout.exercises}
                </Text>
              )}
            </View>

            <Pressable
              onPress={() => router.push('/(tabs)/workout')}
              className="bg-accent active:bg-accent-600 rounded-[13px]"
              style={{ minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel={o.startWorkout}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-[#062815] font-bold text-base">{o.startWorkout}</Text>
                <Ionicons name="arrow-forward" size={16} color="#062815" />
              </View>
            </Pressable>
          </Card>
        )}

        {/* Recovery score */}
        {recoveryScore != null && <RecoveryCard score={recoveryScore} t={o} />}

        {/* Hydration */}
        {data?.hydration && (
          <Card>
            <Text className="text-sm font-medium text-ink-700 dark:text-slate-200 mb-1">{o.hydration}</Text>
            <Text className="text-sm text-ink-500 dark:text-slate-400">
              {formatHydration(data.hydration, lang)}
            </Text>
          </Card>
        )}

        {disclaimer && (
          <Text className="text-xs text-ink-300 italic text-center px-2">{disclaimer}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
