import { View, Text } from 'react-native';
import Card from '../ui/Card';

export default function MealRow({ slot, meal, t }) {
  if (!meal) return null;

  const slotLabel = t.meals[slot] || slot;

  return (
    <Card className="mb-3">
      {/* Slot label + kcal */}
      <View className="flex-row items-center justify-between mb-1.5">
        <Text
          style={{ fontSize: 11.5, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}
          className="text-ink-300 dark:text-slate-500"
        >
          {slotLabel}
        </Text>
        <Text className="text-sm font-bold text-ink-700 dark:text-slate-200">
          {meal.calories} <Text className="text-xs font-normal text-ink-300">{t.meals.kcal}</Text>
        </Text>
      </View>

      {/* Meal name */}
      <Text className="text-base font-semibold text-ink-900 dark:text-white mb-1.5">
        {meal.name}
      </Text>

      {/* Description */}
      {meal.description && (
        <Text className="text-xs text-ink-300 dark:text-slate-500 mb-1.5">{meal.description}</Text>
      )}

      {/* Macro chips */}
      <View className="flex-row gap-3">
        <MacroChip prefix="P" value={meal.macros?.protein} color="text-accent" />
        <MacroChip prefix="C" value={meal.macros?.carbs}   color="text-[#F5A524]" />
        <MacroChip prefix="F" value={meal.macros?.fat}     color="text-[#7C8CFF]" />
      </View>
    </Card>
  );
}

function MacroChip({ prefix, value, color }) {
  if (value == null) return null;
  return (
    <Text className="text-xs font-semibold">
      <Text className={color}>{prefix} </Text>
      <Text className="text-ink-500 dark:text-slate-400">{value}g</Text>
    </Text>
  );
}
