import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ROWS = [
  { key: 'headline',       icon: 'flag-outline',         color: '#14C06A' },
  { key: 'trend',          icon: 'trending-up-outline',  color: '#7C8CFF' },
  { key: 'adherence',      icon: 'calendar-outline',     color: '#F5A524' },
  { key: 'recovery',       icon: 'heart-outline',        color: '#FF6B6B' },
  { key: 'recommendation', icon: 'bulb-outline',         color: '#F5A524' },
];

export default function CoachCard({ narrative }) {
  if (!narrative) return null;

  return (
    <View className="gap-3">
      {ROWS.map(({ key, icon, color }) => {
        const text = narrative[key];
        if (!text) return null;
        return (
          <View key={key} className="flex-row items-start gap-3">
            <View style={{ width: 22, alignItems: 'center', marginTop: 2 }}>
              <Ionicons name={icon} size={16} color={color} />
            </View>
            <Text className="flex-1 text-sm text-ink-700 dark:text-slate-300 leading-relaxed">
              {text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
