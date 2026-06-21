import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

function TabIcon({ name, color, focused }) {
  return <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />;
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
        options={{
          title: t.tabs.overview,
          tabBarIcon: ({ color, focused }) => <TabIcon name="stats-chart" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: t.tabs.workout,
          tabBarIcon: ({ color, focused }) => <TabIcon name="barbell" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: t.tabs.meals,
          tabBarIcon: ({ color, focused }) => <TabIcon name="restaurant" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t.tabs.progress,
          tabBarIcon: ({ color, focused }) => <TabIcon name="trending-up" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t.tabs.plans,
          tabBarIcon: ({ color, focused }) => <TabIcon name="documents" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
