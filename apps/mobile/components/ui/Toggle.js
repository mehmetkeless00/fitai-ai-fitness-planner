import { View, Text, Pressable, ScrollView } from 'react-native';

export default function Toggle({ label, options, value, onChange, className = '' }) {
  return (
    <View className={`gap-1 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{label}</Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onChange(opt.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={opt.label}
                className={`px-4 py-2.5 rounded-[10px] border ${
                  active
                    ? 'bg-accent border-accent'
                    : 'bg-paper dark:bg-slate-800 border-line dark:border-slate-600 active:bg-canvas'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    active ? 'text-[#062815]' : 'text-ink-700 dark:text-slate-300'
                  }`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
