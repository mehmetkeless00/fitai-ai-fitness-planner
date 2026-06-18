import { View, Text } from 'react-native';
import Card from '../ui/Card';

export default function MealRow({ slot, meal, t }) {
  if (!meal) return null;

  return (
    <Card className="mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-ink-700 dark:text-slate-200 capitalize">
          {t.meals[slot] || slot}
        </Text>
        <Text className="text-xs text-ink-300">
          {meal.calories} {t.meals.kcal}
        </Text>
      </View>
      <Text className="text-base font-medium text-ink-900 dark:text-white">{meal.name}</Text>
      {meal.description && (
        <Text className="text-xs text-ink-300 mt-1">{meal.description}</Text>
      )}
      <View className="flex-row gap-3 mt-2">
        <MacroChip label="P" value={meal.macros?.protein} color="text-accent" />
        <MacroChip label="C" value={meal.macros?.carbs} color="text-[#F5A524]" />
        <MacroChip label="F" value={meal.macros?.fat} color="text-[#7C8CFF]" />
      </View>
    </Card>
  );
}

function MacroChip({ label, value, color }) {
  if (value == null) return null;
  return (
    <View className="flex-row items-center gap-0.5">
      <Text className={`text-xs font-semibold ${color}`}>{label}</Text>
      <Text className="text-xs text-ink-500 dark:text-slate-400">{value}g</Text>
    </View>
  );
}
