import { View, Text } from 'react-native';

const ROWS = [
  { key: 'headline', icon: '🏁' },
  { key: 'trend', icon: '📈' },
  { key: 'adherence', icon: '📅' },
  { key: 'recovery', icon: '❤️' },
  { key: 'recommendation', icon: '💡' },
];

export default function CoachCard({ narrative }) {
  if (!narrative) return null;

  return (
    <View className="gap-3">
      {ROWS.map(({ key, icon }) => {
        const text = narrative[key];
        if (!text) return null;
        return (
          <View key={key} className="flex-row items-start gap-3">
            <Text style={{ fontSize: 18, lineHeight: 24 }}>{icon}</Text>
            <Text className="flex-1 text-sm text-ink-700 dark:text-slate-300 leading-relaxed">
              {text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
