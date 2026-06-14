import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getExerciseDemo } from '@fitflow/core';
import { useLanguage } from '../../i18n/LanguageContext';

export default function ExerciseModal() {
  const { ex } = useLocalSearchParams();
  const router = useRouter();
  const { lang } = useLanguage();

  let exercise = null;
  try { exercise = JSON.parse(ex); } catch { /* ignore */ }

  const demo = exercise ? getExerciseDemo(exercise.name, lang) : null;

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center">
        <Text className="text-slate-500">Exercise not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-sky-500 font-medium">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-5 py-6 gap-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-slate-900 dark:text-white flex-1 mr-4">
            {exercise.name}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-sky-500 font-medium">Done</Text>
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {(exercise.muscleGroups || []).map((m) => (
            <View key={m} className="bg-sky-100 dark:bg-sky-900 px-3 py-1 rounded-full">
              <Text className="text-xs text-sky-700 dark:text-sky-300">{m}</Text>
            </View>
          ))}
        </View>

        <View className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 gap-1">
          <Row label="Sets" value={`${exercise.sets}`} />
          <Row label="Reps" value={`${exercise.reps}`} />
          {exercise.restTime && <Row label="Rest" value={`${exercise.restTime}s`} />}
          {exercise.rpe && <Row label="Intensity" value={exercise.rpe} />}
        </View>

        {demo && (
          <>
            {demo.setup && <Section title="Setup" text={demo.setup} />}
            {demo.movement && <Section title="Movement" text={demo.movement} />}
            {demo.breathing && <Section title="Breathing" text={demo.breathing} />}
            {demo.commonMistake && (
              <Section title="Common Mistake" text={demo.commonMistake} accent="red" />
            )}
            {demo.safetyTip && (
              <Section title="Safety Tip" text={demo.safetyTip} accent="green" />
            )}
          </>
        )}

        {(exercise.alternatives || []).length > 0 && (
          <View>
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Alternatives
            </Text>
            {exercise.alternatives.map((a) => (
              <Text key={a} className="text-sm text-slate-500 dark:text-slate-400">• {a}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-sm text-slate-500 dark:text-slate-400">{label}</Text>
      <Text className="text-sm font-medium text-slate-800 dark:text-white">{value}</Text>
    </View>
  );
}

function Section({ title, text, accent }) {
  const colors = {
    red: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    green: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    default: 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700',
  };
  const textColors = {
    red: 'text-red-700 dark:text-red-300',
    green: 'text-green-700 dark:text-green-300',
    default: 'text-slate-700 dark:text-slate-300',
  };
  const c = colors[accent] || colors.default;
  const tc = textColors[accent] || textColors.default;

  return (
    <View className={`rounded-xl p-4 border ${c}`}>
      <Text className={`text-xs font-semibold uppercase tracking-wide mb-1 ${tc}`}>{title}</Text>
      <Text className={`text-sm leading-relaxed ${tc}`}>{text}</Text>
    </View>
  );
}
