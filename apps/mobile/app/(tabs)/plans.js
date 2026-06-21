import { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert, Modal, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { listPlans, deletePlan, renamePlan } from '@fitflow/core';
import { usePlan } from '../../hooks/usePlan';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate } from '../../utils/formatDate';

function RenameModal({ visible, currentName, onSave, onCancel, pl }) {
  const [name, setName] = useState(currentName || '');

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
          className="bg-paper dark:bg-slate-800 rounded-[14px] p-5 w-full"
          onPress={() => {}}
        >
          <Text className="text-base font-semibold text-ink-900 dark:text-white mb-3">
            {pl.renameTitle}
          </Text>
          <TextInput
            className="border border-line dark:border-slate-600 rounded-[10px] px-3 py-3 text-ink-900 dark:text-white bg-canvas dark:bg-slate-700 text-sm"
            value={name}
            onChangeText={setName}
            placeholder={pl.renamePlaceholder}
            placeholderTextColor="#A7A8AD"
            autoFocus
            accessibilityLabel={pl.renamePlaceholder}
          />
          <View className="flex-row gap-2 mt-4">
            <Pressable
              className="flex-1 border border-line dark:border-slate-600 py-3 rounded-[10px] items-center"
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel={pl.cancel}
            >
              <Text className="text-ink-500 dark:text-slate-300 font-medium">{pl.cancel}</Text>
            </Pressable>
            <Pressable
              className="flex-1 bg-accent active:bg-accent-600 py-3 rounded-[10px] items-center"
              onPress={() => onSave(name.trim())}
              accessibilityRole="button"
              accessibilityLabel={pl.renameSave}
            >
              <Text className="text-[#062815] font-semibold">{pl.renameSave}</Text>
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
  const [renameTarget, setRenameTarget] = useState(null);

  function refresh() {
    setPlans(listPlans());
  }

  useFocusEffect(useCallback(() => { refresh(); }, []));

  function handleActivate(id) {
    activatePlan(id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    <SafeAreaView className="flex-1 bg-canvas dark:bg-slate-900">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-6 pb-3">
          <Text
            className="text-xl font-bold text-ink-900 dark:text-white"
            accessibilityRole="header"
          >
            {pl.title}
          </Text>
          <View className="flex-row gap-2 items-center">
            <Pressable
              onPress={() => router.push('/modal/settings')}
              className="w-9 h-9 items-center justify-center rounded-full bg-paper border border-line dark:bg-slate-800 dark:border-slate-700"
              accessibilityRole="button"
              accessibilityLabel={t.settings.title}
            >
              <Text style={{ fontSize: 18 }}>⚙️</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/create')}
              className="bg-accent active:bg-accent-600 px-4 py-2 rounded-full"
              accessibilityRole="button"
              accessibilityLabel={pl.newPlan}
            >
              <Text className="text-[#062815] text-sm font-semibold">{pl.newPlan}</Text>
            </Pressable>
          </View>
        </View>

        {plans.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8 gap-3">
            <View className="w-16 h-16 rounded-[20px] bg-paper border border-line dark:bg-slate-800 dark:border-slate-700 items-center justify-center">
              <Text style={{ fontSize: 28 }}>📋</Text>
            </View>
            <Text className="text-ink-500 dark:text-slate-400 text-center text-sm">{pl.noPlan}</Text>
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
                    className={`mb-3 rounded-[14px] p-4 border ${
                      isActive
                        ? 'bg-accent-wash dark:bg-accent/10 border-accent dark:border-accent/50'
                        : 'bg-paper dark:bg-slate-800 border-line dark:border-slate-700'
                    }`}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name || pl.unnamed}${isActive ? pl.activeSuffix : ''}`}
                    accessibilityHint={pl.longPressHint}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`font-semibold flex-1 mr-2 ${
                          isActive ? 'text-accent-600 dark:text-accent' : 'text-ink-900 dark:text-white'
                        }`}
                        numberOfLines={1}
                      >
                        {item.name || pl.unnamed}
                      </Text>
                      {isActive && (
                        <View className="bg-accent rounded-full px-2 py-0.5">
                          <Text className="text-[#062815] text-xs font-semibold">{pl.active}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-ink-300 dark:text-slate-500 mt-1">
                      {pl.created} {formatDate(item.createdAt, lang)}
                    </Text>
                  </Pressable>
                );
              }}
            />
            <Text className="text-xs text-ink-300 dark:text-slate-500 text-center pb-3">{pl.longPressHint}</Text>
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
