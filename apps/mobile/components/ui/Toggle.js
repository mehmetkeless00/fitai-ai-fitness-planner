import { View, Text, Pressable, ScrollView } from 'react-native';

export default function Toggle({ label, options, value, onChange, className = '' }) {
  return (
    <View className={`gap-1 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</Text>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onChange(opt.value)}
                className={`px-4 py-2.5 rounded-lg border ${
                  active
                    ? 'bg-sky-500 border-sky-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 active:bg-slate-50'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    active ? 'text-white' : 'text-slate-700 dark:text-slate-300'
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
