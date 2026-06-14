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
        <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</Text>
      )}
      <TextInput
        className={`border rounded-xl px-4 py-3 text-slate-900 dark:text-white bg-white dark:bg-slate-800 text-base
          ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-600'} ${inputClassName}`}
        placeholderTextColor="#94a3b8"
        {...props}
      />
      {error && (
        <Text className="text-xs text-red-500">{error}</Text>
      )}
    </View>
  );
}
