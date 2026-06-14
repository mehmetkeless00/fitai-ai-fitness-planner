import { Stack } from 'expo-router';
import { CreatePlanProvider } from './context';

export default function CreateLayout() {
  return (
    <CreatePlanProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CreatePlanProvider>
  );
}
