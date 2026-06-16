import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function ErrorBoundary({ error }) {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 items-center justify-center px-8">
      <Text style={{ fontSize: 40 }}>⚠️</Text>
      <Text className="text-xl font-bold text-slate-900 dark:text-white mt-4 text-center">
        Something went wrong{'\n'}Bir şeyler ters gitti
      </Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center leading-relaxed">
        {error?.message || 'Please restart the app.\nLütfen uygulamayı yeniden başlatın.'}
      </Text>
      <Pressable
        onPress={() => router.replace('/')}
        className="mt-6 bg-sky-500 active:bg-sky-600 px-6 py-3 rounded-xl"
        accessibilityRole="button"
        accessibilityLabel="Go to home / Ana ekrana git"
      >
        <Text className="text-white font-semibold">Go home / Ana ekran</Text>
      </Pressable>
    </SafeAreaView>
  );
}
