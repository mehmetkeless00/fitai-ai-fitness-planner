import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { listPlans, deletePlan, renamePlan } from '@fitflow/core';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate } from '../../utils/formatDate';

function RenameModal({ visible, currentName, onSave, onCancel, pl }) {
  const [name, setName] = useState(currentName || '');

  // Sync when opened with a different plan
  const handleOpen = () => setName(currentName || '');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      onShow={handleOpen}
      accessibilityViewIsModal
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center px-6"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 w-full"
          onPress={() => {}}
        >
          <Text className="text-base font-semibold text-slate-900 dark:text-white mb-3">
            {pl.renameTitle}
          </Text>
          <TextInput
            className="border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 text-sm"
            value={name}
            onChangeText={setName}
            placeholder={pl.renamePlaceholder}
            placeholderTextColor="#94a3b8"
            autoFocus
            accessibilityLabel={pl.renamePlaceholder}
          />
          <View className="flex-row gap-2 mt-4">
            <Pressable
              className="flex-1 border border-slate-200 dark:border-slate-600 py-3 rounded-xl items-center"
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={pl.cancel}
            >
              <Text className="text-slate-600 dark:text-slate-300 font-medium">{pl.cancel}</Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-sky-500 py-3 rounded-xl items-center"
              onPress={() => onSave(name.trim())}
              accessibilityRole="button"
              accessibilityLabel={pl.renameSave}
            >
              <Text className="text-white font-semibold">{pl.renameSave}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function PlansTab() {
  const router = useRouter();
  const { plan: activePlan, activatePlan } = usePlan();
  const { t, lang } = useLanguage();
  const pl = t.plans;

  const [plans, setPlans] = useState([]);
  const [renameTarget, setRenameTarget] = useState(null); // { id, name }

  function refresh() {
    setPlans(listPlans());
  }

  useFocusEffect(useCallback(() => { refresh(); }, []));

  function handleActivate(id) {
    activatePlan(id);
    refresh();
  }

  function handleLongPress(item) {
    Alert.alert(item.name || 'Plan', null, [
      {
        text: pl.rename,
        onPress: () => setRenameTarget({ id: item.id, name: item.name || '' }),
      },
      {
        text: pl.delete,
        style: 'destructive',
        onPress: () => confirmDelete(item.id, item.name),
      },
      { text: pl.cancel, style: 'cancel' },
    ]);
  }

  function confirmDelete(id, name) {
    Alert.alert(pl.deleteConfirmTitle, `"${name}" ${pl.deleteConfirmMsg}`, [
      { text: pl.cancel, style: 'cancel' },
      {
        text: pl.delete,
        style: 'destructive',
        onPress: () => { deletePlan(id); refresh(); },
      },
    ]);
  }

  function handleRenameSave(name) {
    if (renameTarget) {
      renamePlan(renameTarget.id, name);
      setRenameTarget(null);
      refresh();
    }
  }

  const activeId = activePlan?.id;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-6 pb-3">
          <Text
            className="text-xl font-bold text-slate-900 dark:text-white"
            accessibilityRole="header"
          >
            {pl.title}
          </Text>
          <View className="flex-row gap-2 items-center">
            <Pressable
              onPress={() => router.push('/modal/settings')}
              className="w-9 h-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
              accessibilityRole="button"
              accessibilityLabel={t.settings.title}
            >
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/create')}
              className="bg-sky-500 active:bg-sky-600 px-4 py-2 rounded-full"
              accessibilityRole="button"
              accessibilityLabel={pl.newPlan}
            >
              <Text className="text-white text-sm font-medium">{pl.newPlan}</Text>
            </Pressable>
          </View>
        </View>

        {plans.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-slate-400 text-center">{pl.noPlan}</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={plans}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
              renderItem={({ item }) => {
                const isActive = item.id === activeId;
                return (
                  <Pressable
                    onPress={() => handleActivate(item.id)}
                    onLongPress={() => handleLongPress(item)}
                    className={`mb-3 rounded-xl p-4 border ${
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-900/30 border-sky-300 dark:border-sky-700'
                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                    }`}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name || 'Unnamed plan'}${isActive ? ', active' : ''}`}
                    accessibilityHint={pl.longPressHint}
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
                      {pl.created} {formatDate(item.createdAt, lang)}
                    </Text>
                  </Pressable>
                );
              }}
            />
            <Text className="text-xs text-slate-400 text-center pb-3">{pl.longPressHint}</Text>
          </>
        )}
      </View>

      {/* Rename modal */}
      <RenameModal
        visible={!!renameTarget}
        currentName={renameTarget?.name || ''}
        onSave={handleRenameSave}
        onCancel={() => setRenameTarget(null)}
        pl={pl}
      />
    </SafeAreaView>
  );
}
