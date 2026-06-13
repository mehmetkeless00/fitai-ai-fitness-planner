// Local-first store for daily check-ins (weight + completed workouts).
// Mirrors the planStorage pattern: versioned schema, defensive reads,
// and an optional sync listener so cloud mirroring stays outside this module.

const STORE_KEY = 'fitflow.progress.v1';
export const MAX_ENTRIES = 120;

let syncHandler = null;

export function setProgressSyncHandler(fn) {
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
  try {
    return globalThis.localStorage || null;
  } catch {
    return null;
  }
}

function emptyStore() {
  return { v: 1, entries: [] };
}

function makeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

function writeStore(store) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

function readStore() {
  const storage = getStorage();
  if (!storage) return emptyStore();
  try {
    const raw = storage.getItem(STORE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    if (parsed && parsed.v === 1 && Array.isArray(parsed.entries)) {
      return parsed;
    }
    return emptyStore();
  } catch {
    return emptyStore();
  }
}

// Entries sorted oldest → newest (charting order).
export function listCheckins() {
  return [...readStore().entries].sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function getCheckin(date) {
  return readStore().entries.find((e) => e.date === date) || null;
}

// Upserts by calendar date ('YYYY-MM-DD'): one check-in per day.
export function saveCheckin({ date, weight = null, workoutsDone = [] }) {
  if (!date) return null;
  const store = readStore();
  const existing = store.entries.find((e) => e.date === date);

  let entry;
  if (existing) {
    existing.weight = weight ?? existing.weight;
    existing.workoutsDone = workoutsDone;
    entry = existing;
  } else {
    entry = { id: makeId(), date, weight, workoutsDone };
    store.entries.push(entry);
  }

  // Keep the most recent MAX_ENTRIES days
  store.entries = store.entries
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(-MAX_ENTRIES);

  writeStore(store);
  notify('save', entry);
  return entry.id;
}

export function deleteCheckin(id) {
  const store = readStore();
  const before = store.entries.length;
  store.entries = store.entries.filter((e) => e.id !== id);
  if (store.entries.length !== before) {
    writeStore(store);
    notify('delete', { id });
  }
}

// Merges entries fetched from the cloud. Incoming wins on id; if two entries
// share a date, the incoming (cloud) one wins — same one-per-day rule.
export function importCheckins(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return;
  const store = readStore();
  const incoming = entries.filter((e) => e && e.id && e.date);
  const incomingIds = new Set(incoming.map((e) => e.id));
  const incomingDates = new Set(incoming.map((e) => e.date));

  store.entries = [
    ...incoming,
    ...store.entries.filter((e) => !incomingIds.has(e.id) && !incomingDates.has(e.date)),
  ]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .slice(-MAX_ENTRIES);

  writeStore(store);
}
