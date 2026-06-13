import { getAdapter } from './storage/adapter.js';

const STORE_KEY = 'fitflow.plans.v2';
const LEGACY_KEY = 'userPlan';
export const MAX_PLANS = 10;

// Optional mutation listener used by the cloud sync layer. Local storage stays
// the source of truth; when a user is signed in, mutations are mirrored to the
// cloud through this hook. Errors in the handler never break local persistence.
let syncHandler = null;

export function setSyncHandler(fn) {
  syncHandler = fn;
}

function notify(type, payload) {
  if (!syncHandler) return;
  try {
    syncHandler(type, payload);
  } catch {
    // Cloud mirroring must never break local persistence.
  }
}

function getStorage() {
  return getAdapter();
}

function emptyStore() {
  return { v: 2, activeId: null, plans: [] };
}

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function makeEntry(data, name = null) {
  return {
    id: makeId(),
    name,
    createdAt: data?.generatedAt || new Date().toISOString(),
    data,
  };
}

function writeStore(store) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // Quota exceeded or storage disabled — the app keeps working in-memory.
  }
}

// Migrates the pre-v2 single-plan key into the versioned store, exactly once.
function migrateLegacy(storage) {
  let raw;
  try {
    raw = storage.getItem(LEGACY_KEY);
  } catch {
    return emptyStore();
  }
  if (!raw) return emptyStore();

  const store = emptyStore();
  try {
    const data = JSON.parse(raw);
    const entry = makeEntry(data);
    store.plans = [entry];
    store.activeId = entry.id;
    writeStore(store);
  } catch {
    // Corrupted legacy data: drop it rather than crash forever.
  }
  try {
    storage.removeItem(LEGACY_KEY);
  } catch {}
  return store;
}

function readStore() {
  const storage = getStorage();
  if (!storage) return emptyStore();
  try {
    const raw = storage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.v === 2 && Array.isArray(parsed.plans)) {
        return parsed;
      }
      return emptyStore();
    }
    return migrateLegacy(storage);
  } catch {
    return emptyStore();
  }
}

export function listPlans() {
  return readStore().plans;
}

export function getPlan(id) {
  return readStore().plans.find((p) => p.id === id) || null;
}

export function getActivePlan() {
  const store = readStore();
  return store.plans.find((p) => p.id === store.activeId) || store.plans[0] || null;
}

export function savePlan(data, name = null) {
  const store = readStore();
  const entry = makeEntry(data, name);
  store.plans = [entry, ...store.plans].slice(0, MAX_PLANS);
  store.activeId = entry.id;
  writeStore(store);
  notify('save', entry);
  return entry.id;
}

// Merges plan entries (typically fetched from the cloud) into the local store.
// Incoming entries win on id collision; result is newest-first, capped.
export function importPlans(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return;
  const store = readStore();
  const incomingIds = new Set(entries.map((e) => e.id));
  const merged = [...entries, ...store.plans.filter((p) => !incomingIds.has(p.id))]
    .filter((e) => e && e.id && e.data)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, MAX_PLANS);
  store.plans = merged;
  if (!merged.some((p) => p.id === store.activeId)) {
    store.activeId = merged[0]?.id || null;
  }
  writeStore(store);
}

export function setActivePlan(id) {
  const store = readStore();
  if (store.plans.some((p) => p.id === id)) {
    store.activeId = id;
    writeStore(store);
  }
}

export function updatePlanData(id, data) {
  const store = readStore();
  const plan = store.plans.find((p) => p.id === id);
  if (plan) {
    plan.data = data;
    writeStore(store);
    notify('save', plan);
  }
}

export function renamePlan(id, name) {
  const store = readStore();
  const plan = store.plans.find((p) => p.id === id);
  if (plan) {
    plan.name = (name || '').trim() || null;
    writeStore(store);
    notify('save', plan);
  }
}

export function deletePlan(id) {
  const store = readStore();
  store.plans = store.plans.filter((p) => p.id !== id);
  if (store.activeId === id) {
    store.activeId = store.plans[0]?.id || null;
  }
  writeStore(store);
  notify('delete', { id });
}
