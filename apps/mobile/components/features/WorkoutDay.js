import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../ui/Card';

const REST_FOCUSES = new Set([
  'Active Recovery',
  'Active Recovery & Mobility',
  'Rest or Active Recovery',
  'Complete Rest',
]);

export default function WorkoutDay({ day, t, maps, onExercisePress, isToday }) {
  const [open, setOpen] = useState(() => !!isToday);
  const isRest = !day.exercises || day.exercises.length === 0;
  const isRestType = REST_FOCUSES.has(day.focus);

  const dayLabel = maps?.days?.[day.day] || day.day;
  const focusLabel = maps?.workoutFocus?.[day.focus] || day.focus;

  return (
    <Card className={`mb-3${isToday ? ' border-accent dark:border-accent' : ''}`}>
      <Pressable
        onPress={() => !isRest && setOpen((v) => !v)}
        className="flex-row items-center justify-between"
        accessibilityRole="button"
        accessibilityLabel={`${dayLabel}${focusLabel ? ', ' + focusLabel : ''}`}
        accessibilityState={{ expanded: open }}
      >
        <View className="flex-1 mr-2">
          <View className="flex-row items-center gap-1.5">
            {isToday && <View className="w-1.5 h-1.5 rounded-full bg-accent" />}
            <Text className="font-semibold text-slate-900 dark:text-white">{dayLabel}</Text>
          </View>
          {focusLabel && (
            <Text className="text-xs text-slate-400 mt-0.5">{focusLabel}</Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {isRest ? (
            <Text className="text-xs text-slate-400">{t.rest}</Text>
          ) : isRestType ? (
            <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#A7A8AD" />
          ) : (
            <>
              <Text className="text-xs text-slate-400">
                {day.exercises.length} {t.exercises}
              </Text>
              <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#A7A8AD" />
            </>
          )}
        </View>
      </Pressable>

      {open && !isRest && (
        <View className="mt-3 gap-2">
          {day.exercises.map((ex, i) => (
            <Pressable
              key={i}
              onPress={() => onExercisePress && onExercisePress(ex)}
              className="bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2.5 flex-row items-center justify-between active:bg-slate-100"
              accessibilityRole="button"
              accessibilityLabel={ex.name}
            >
              <View className="flex-1 mr-2">
                <Text className="text-sm font-medium text-slate-800 dark:text-white">{ex.name}</Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  {ex.sets} {t.sets} × {ex.reps} {t.reps}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );
}
