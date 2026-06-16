import { View, Text } from 'react-native';

const variants = {
  success: { container: 'bg-accent-wash border-accent/20', text: 'text-accent-600' },
  warning: { container: 'bg-[#FEF3E2] border-[#F5A524]/20', text: 'text-[#9A6000]' },
  danger:  { container: 'bg-[#FDECEA] border-[#E0563E]/20', text: 'text-semantic-danger' },
  neutral: { container: 'bg-canvas border-line', text: 'text-ink-500' },
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  const { container, text } = variants[variant] || variants.neutral;
  return (
    <View className={`self-start flex-row items-center px-2.5 py-0.5 rounded-full border ${container} ${className}`}>
      <Text className={`text-xs font-semibold ${text}`}>{children}</Text>
    </View>
  );
}
