import { Stack } from 'expo-router';
import { CreatePlanProvider } from '../../contexts/createPlanContext';

export default function CreateLayout() {
  return (
    <CreatePlanProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CreatePlanProvider>
  );
}
