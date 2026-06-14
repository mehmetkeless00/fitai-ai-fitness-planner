import { useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, Pressable, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { listPlans, deletePlan } from '@fitflow/core';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';

export default function PlansTab() {
  const router = useRouter();
  const { plan: activePlan, activatePlan } = usePlan();
  const { t } = useLanguage();
  const pl = t.plans;

  const [plans, setPlans] = useState([]);

  function refresh() {
    setPlans(listPlans());
  }

  useFocusEffect(useCallback(() => { refresh(); }, []));

  function handleActivate(id) {
    activatePlan(id);
    refresh();
  }

  function handleDelete(id, name) {
    Alert.alert(pl.deleteConfirmTitle, `"${name}" ${pl.deleteConfirmMsg}`, [
      { text: pl.cancel, style: 'cancel' },
      {
        text: pl.delete,
        style: 'destructive',
        onPress: () => {
          deletePlan(id);
          refresh();
        },
      },
    ]);
  }

  const activeId = activePlan?.id;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4 pt-6 pb-3">
          <Text className="text-xl font-bold text-slate-900 dark:text-white">{pl.title}</Text>
          <Pressable
            onPress={() => router.push('/create')}
            className="bg-sky-500 active:bg-sky-600 px-4 py-2 rounded-full"
          >
            <Text className="text-white text-sm font-medium">{pl.newPlan}</Text>
          </Pressable>
        </View>

        {plans.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-slate-400 text-center">{pl.noPlan}</Text>
          </View>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            renderItem={({ item }) => {
              const isActive = item.id === activeId;
              return (
                <Pressable
                  onPress={() => handleActivate(item.id)}
                  onLongPress={() => handleDelete(item.id, item.name)}
                  className={`mb-3 rounded-xl p-4 border ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`font-semibold flex-1 mr-2 ${
                        isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-white'
                      }`}
                      numberOfLines={1}
                    >
                      {item.name || 'Unnamed plan'}
                    </Text>
                    {isActive && (
                      <View className="bg-sky-500 rounded-full px-2 py-0.5">
                        <Text className="text-white text-xs font-medium">{pl.active}</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-slate-400 mt-1">
                    {pl.created} {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
