import { Pressable, Text, ActivityIndicator } from 'react-native';

export default function Button({
  onPress,
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
}) {
  const base = 'py-3.5 px-6 rounded-xl items-center justify-center flex-row gap-2';
  const variants = {
    primary: 'bg-sky-500 active:bg-sky-600',
    secondary: 'border border-slate-200 dark:border-slate-600 active:bg-slate-50 dark:active:bg-slate-700',
    danger: 'bg-red-500 active:bg-red-600',
  };
  const textVariants = {
    primary: 'text-white font-semibold',
    secondary: 'text-slate-700 dark:text-slate-300 font-medium',
    danger: 'text-white font-semibold',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${(disabled || loading) ? 'opacity-50' : ''} ${className}`}
    >
      {loading && <ActivityIndicator size="small" color={variant === 'secondary' ? '#64748b' : '#fff'} />}
      <Text className={textVariants[variant]}>{children}</Text>
    </Pressable>
  );
}
