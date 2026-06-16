import { Pressable, Text, ActivityIndicator } from 'react-native';

export default function Button({
  onPress,
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}) {
  const base = 'py-3.5 px-6 rounded-[12px] items-center justify-center flex-row gap-2';
  const variants = {
    primary: 'bg-accent active:bg-accent-600',
    secondary: 'border border-line active:bg-canvas',
    danger: 'bg-semantic-danger active:opacity-80',
  };
  const textVariants = {
    primary: 'text-[#062815] font-semibold',
    secondary: 'text-ink-700 font-medium',
    danger: 'text-white font-semibold',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      className={`${base} ${variants[variant]} ${(disabled || loading) ? 'opacity-50' : ''} ${className}`}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'primary' ? '#062815' : variant === 'secondary' ? '#3A3B40' : '#fff'} />}
      <Text className={textVariants[variant]}>{children}</Text>
    </Pressable>
  );
}
