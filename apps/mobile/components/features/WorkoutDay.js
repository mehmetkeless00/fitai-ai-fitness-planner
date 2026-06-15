import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Card from '../ui/Card';

export default function WorkoutDay({ day, t, maps, onExercisePress }) {
  const [open, setOpen] = useState(false);
  const isRest = !day.exercises || day.exercises.length === 0;

  const dayLabel = maps?.days?.[day.day] || day.day;
  const focusLabel = maps?.workoutFocus?.[day.focus] || day.focus;

  return (
    <Card className="mb-3">
      <Pressable
        onPress={() => !isRest && setOpen((v) => !v)}
        className="flex-row items-center justify-between"
        accessibilityRole="button"
        accessibilityLabel={`${dayLabel}${focusLabel ? ', ' + focusLabel : ''}`}
        accessibilityState={{ expanded: open }}
      >
        <View>
          <Text className="font-semibold text-slate-900 dark:text-white">{dayLabel}</Text>
          {focusLabel && (
            <Text className="text-xs text-slate-400 mt-0.5">{focusLabel}</Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {isRest ? (
            <Text className="text-xs text-slate-400">{t.rest}</Text>
          ) : (
            <>
              <Text className="text-xs text-slate-400">
                {day.exercises.length} {t.exercises}
              </Text>
              <Text className="text-slate-400">{open ? '▲' : '▼'}</Text>
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
              <Text className="text-slate-300 text-xs">›</Text>
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );
}
