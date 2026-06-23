import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getExerciseDemo, translations } from '@fitflow/core';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../i18n/LanguageContext';

const CATEGORY_ICONS = {
  chest: 'fitness-outline',
  back: 'barbell-outline',
  legs: 'barbell-outline',
  arms: 'fitness-outline',
  shoulders: 'fitness-outline',
  fullbody: 'barbell-outline',
  cardio: 'walk-outline',
  flexibility: 'body-outline',
  core: 'body-outline',
};

const TYPE_ICONS = {
  Compound: 'barbell-outline',
  Isolation: 'fitness-outline',
  Cardio: 'walk-outline',
  Flexibility: 'body-outline',
  Recovery: 'body-outline',
};

export default function ExerciseModal() {
  const { ex } = useLocalSearchParams();
  const router = useRouter();
  const { lang, t } = useLanguage();
  const w = t.workout;

  let exercise = null;
  try { exercise = JSON.parse(ex); } catch { /* ignore */ }

  const demo = exercise ? getExerciseDemo(exercise.name, lang) : null;
  const demoIcon = demo?.icon
    || CATEGORY_ICONS[demo?.category]
    || TYPE_ICONS[exercise?.exerciseType]
    || 'barbell-outline';
  const iconColor = '#0E8A4C';

  const ed = (translations[lang] || translations.en).exerciseDemo;

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900 items-center justify-center">
        <Text className="text-ink-300 dark:text-slate-500">{w.exerciseNotFound}</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-accent font-medium">{w.done}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-5 py-6 gap-4">

        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1 mr-4">
            <View className="w-11 h-11 rounded-[13px] bg-accent-wash items-center justify-center">
              <Ionicons name={demoIcon} size={22} color={iconColor} />
            </View>
            <Text className="text-xl font-bold text-ink-900 dark:text-white flex-1">
              {exercise.name}
            </Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={w.done}
            style={{ minHeight: 44, justifyContent: 'center' }}
          >
            <Text className="text-accent font-medium">{w.done}</Text>
          </Pressable>
        </View>

        {/* Muscle group chips */}
        {(exercise.muscleGroups || []).length > 0 && (
          <View className="flex-row flex-wrap gap-2">
            {exercise.muscleGroups.map((m) => (
              <View key={m} className="bg-accent-wash dark:bg-accent/10 px-3 py-1 rounded-full">
                <Text className="text-xs text-accent-600 dark:text-accent font-medium">{m}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Stats card */}
        <Card>
          <Row label={w.setsLabel} value={`${exercise.sets}`} />
          <Row label={w.repsLabel} value={`${exercise.reps}`} />
          {exercise.restTime && <Row label={w.restLabel} value={`${exercise.restTime}s`} />}
          {exercise.rpe && <Row label={w.intensityLabel} value={exercise.rpe} />}
          {(demo?.equipment || []).length > 0 && (
            <Row label={w.equipmentLabel} value={demo.equipment.join(', ')} />
          )}
        </Card>

        {/* Instructions — only shown when exercise is in the map */}
        {demo && (
          <>
            {demo.setup && <Section title={ed.setup} text={demo.setup} />}
            {demo.movement && <Section title={ed.movement} text={demo.movement} />}
            {demo.breathing && <Section title={ed.breathing} text={demo.breathing} />}
            {demo.commonMistake && (
              <Section title={ed.commonMistake} text={demo.commonMistake} accent="red" />
            )}
            {demo.safety && (
              <Section title={ed.safetyTip} text={demo.safety} accent="green" />
            )}
          </>
        )}

        {/* Alternatives */}
        {(exercise.alternatives || []).length > 0 && (
          <Card>
            <Text
              className="text-ink-300 dark:text-slate-500 mb-2"
              style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}
            >
              {w.alternativesLabel}
            </Text>
            {exercise.alternatives.map((a) => (
              <Text key={a} className="text-sm text-ink-500 dark:text-slate-400 mt-1">• {a}</Text>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className="text-sm text-ink-300 dark:text-slate-500">{label}</Text>
      <Text className="text-sm font-medium text-ink-900 dark:text-white">{value}</Text>
    </View>
  );
}

function Section({ title, text, accent }) {
  const colors = {
    red: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50',
    green: 'bg-accent-wash dark:bg-accent/10 border-accent/20 dark:border-accent/20',
    default: 'bg-paper dark:bg-slate-800 border-line dark:border-slate-700',
  };
  const titleColors = {
    red: 'text-red-600 dark:text-red-400',
    green: 'text-accent-600 dark:text-accent',
    default: 'text-ink-300 dark:text-slate-500',
  };
  const textColors = {
    red: 'text-red-700 dark:text-red-300',
    green: 'text-ink-700 dark:text-slate-300',
    default: 'text-ink-700 dark:text-slate-300',
  };
  const c = colors[accent] || colors.default;
  const tc = titleColors[accent] || titleColors.default;
  const tx = textColors[accent] || textColors.default;

  return (
    <View className={`rounded-[16px] p-4 border ${c}`}>
      <Text
        className={`mb-1.5 ${tc}`}
        style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}
      >
        {title}
      </Text>
      <Text className={`text-sm leading-relaxed ${tx}`}>{text}</Text>
    </View>
  );
}
