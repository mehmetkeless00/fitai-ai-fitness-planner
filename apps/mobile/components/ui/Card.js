import { View } from 'react-native';

export default function Card({ children, className = '' }) {
  return (
    <View
      className={`bg-paper dark:bg-slate-800 rounded-[14px] border border-line dark:border-slate-700 p-4 ${className}`}
    >
      {children}
    </View>
  );
}
