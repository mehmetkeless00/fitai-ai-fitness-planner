import { Text, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

export default function TabLayout() {
  const { t } = useLanguage();
  const isDark = useColorScheme() === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#14C06A',
        tabBarInactiveTintColor: '#A7A8AD',
        tabBarStyle: {
          backgroundColor: isDark ? '#0f172a' : '#FFFFFF',
          borderTopColor: isDark ? '#1e293b' : '#E7E6E1',
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
