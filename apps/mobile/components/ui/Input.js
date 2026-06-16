import { View, Text, TextInput } from 'react-native';

export default function Input({
  label,
  error,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <View className={`gap-1 ${className}`}>
      {label && (
        <Text className="text-sm font-medium text-ink-700 dark:text-slate-300">{label}</Text>
      )}
      <TextInput
        className={`border rounded-[10px] px-4 py-3 text-ink-900 dark:text-white bg-paper dark:bg-slate-800 text-base
          ${error ? 'border-semantic-danger' : 'border-line dark:border-slate-600'} ${inputClassName}`}
        placeholderTextColor="#A7A8AD"
        accessibilityLabel={label}
        accessibilityHint={error || undefined}
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-500">{error}</Text>
      )}
    </View>
  );
}
