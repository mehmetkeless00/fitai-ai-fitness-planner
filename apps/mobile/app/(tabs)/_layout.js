import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#e2e8f0',
        },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{ title: t.tabs.overview, tabBarIcon: ({ color }) => <TabIcon emoji="📊" color={color} /> }}
      />
      <Tabs.Screen
        name="workout"
        options={{ title: t.tabs.workout, tabBarIcon: ({ color }) => <TabIcon emoji="💪" color={color} /> }}
      />
      <Tabs.Screen
        name="meals"
        options={{ title: t.tabs.meals, tabBarIcon: ({ color }) => <TabIcon emoji="🥗" color={color} /> }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: t.tabs.progress, tabBarIcon: ({ color }) => <TabIcon emoji="📈" color={color} /> }}
      />
      <Tabs.Screen
        name="plans"
        options={{ title: t.tabs.plans, tabBarIcon: ({ color }) => <TabIcon emoji="📋" color={color} /> }}
      />
    </Tabs>
  );
}
