import AsyncStorage from '@react-native-async-storage/async-storage';

const FITFLOW_KEYS = ['fitflow.plans.v2', 'fitflow.progress.v1', 'fitflow.lang', 'fitflow.units', 'fitflow.notifications'];
const cache = new Map();

export async function initStorage() {
  const pairs = await AsyncStorage.multiGet(FITFLOW_KEYS);
  for (const [k, v] of pairs) {
    if (v !== null) cache.set(k, v);
  }
}

export const asyncAdapter = {
  getItem: (k) => cache.get(k) ?? null,
  setItem: (k, v) => {
    cache.set(k, String(v));
    AsyncStorage.setItem(k, String(v));
  },
  removeItem: (k) => {
    cache.delete(k);
    AsyncStorage.removeItem(k);
  },
};
