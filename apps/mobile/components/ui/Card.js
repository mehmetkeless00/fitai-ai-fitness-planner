import { View } from 'react-native';

export default function Card({ children, className = '' }) {
  return (
    <View
      className={`bg-paper dark:bg-slate-800 rounded-[20px] border border-line dark:border-slate-700 p-4 ${className}`}
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 }}
    >
      {children}
    </View>
  );
}
