import { View } from 'react-native';

export default function StepStrip({ current, total }) {
  return (
    <View className="flex-row gap-1.5 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <View key={i} className={`h-1 rounded-full flex-1 ${i < current ? 'bg-accent' : 'bg-line'}`} />
      ))}
    </View>
  );
}
