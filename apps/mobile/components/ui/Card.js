import { View } from 'react-native';

export default function Card({ children, className = '' }) {
  return (
    <View
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 ${className}`}
    >
      {children}
    </View>
  );
}
