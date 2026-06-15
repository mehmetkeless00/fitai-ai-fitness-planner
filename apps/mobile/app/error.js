import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ErrorBoundary({ error }) {
  const router = useRouter();
  const message = error?.message || 'Something went wrong.';

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center px-8">
      <Text style={{ fontSize: 40 }}>⚠️</Text>
      <Text className="text-xl font-bold text-slate-900 dark:text-white mt-4 text-center">
        Unexpected error
      </Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center leading-relaxed">
        {message}
      </Text>
      <Pressable
        onPress={() => router.replace('/')}
        className="mt-6 bg-sky-500 active:bg-sky-600 px-6 py-3 rounded-xl"
        accessibilityRole="button"
        accessibilityLabel="Go to home"
      >
        <Text className="text-white font-semibold">Go to home</Text>
      </Pressable>
    </SafeAreaView>
  );
}
