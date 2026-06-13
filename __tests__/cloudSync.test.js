import { describe, it, expect, beforeEach } from 'vitest';
import {
  savePlan,
  listPlans,
  importPlans,
  setSyncHandler,
  deletePlan,
  renamePlan,
  updatePlanData,
  getActivePlan,
  MAX_PLANS,
} from '../utils/planStorage.js';
import { mirrorMutation, mirrorCheckinMutation, fullSync } from '../utils/cloudSync.js';
import { saveCheckin, listCheckins, setProgressSyncHandler } from '../utils/progressStorage.js';

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(k) {
    return this.map.has(k) ? this.map.get(k) : null;
  }
  setItem(k, v) {
    this.map.set(k, String(v));
  }
  removeItem(k) {
    this.map.delete(k);
  }
}

// Minimal Supabase stub recording calls and serving canned rows.
function makeStubClient(rows = []) {
  const calls = { upserts: [], deletes: [] };
  const client = {
    calls,
    from: () => ({
      upsert: async (payload) => {
        calls.upserts.push(payload);
        return { error: null };
      },
      delete: () => ({
        eq: async (_col, id) => {
          calls.deletes.push(id);
          return { error: null };
        },
      }),
      select: () => ({
        order: async () => ({ data: rows, error: null }),
      }),
    }),
  };
  return client;
}

const sample = (n = 1) => ({
  fitnessGoal: 'build-muscle',
  dailyCalories: 2000 + n,
  generatedAt: new Date(2026, 0, n).toISOString(),
});

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
  setSyncHandler(null);
  setProgressSyncHandler(null);
});

// Table-aware stub for tests that exercise both plans and checkins.
function makeTableStub(tables = {}) {
  const calls = { upserts: [], deletes: [] };
  const client = {
    calls,
    from: (table) => ({
      upsert: async (payload) => {
        calls.upserts.push({ table, payload });
        return { error: null };
      },
      delete: () => ({
        eq: async (_col, id) => {
          calls.deletes.push({ table, id });
          return { error: null };
        },
      }),
      select: () => ({
        order: async () => ({ data: tables[table] || [], error: null }),
      }),
    }),
  };
  return client;
}

describe('importPlans (cloud → local merge)', () => {
  it('unions by id, incoming wins, newest first, capped', () => {
    const localId = savePlan(sample(1));
    const incoming = [];
    for (let i = 2; i <= MAX_PLANS + 1; i++) {
      incoming.push({ id: `cloud-${i}`, name: null, createdAt: new Date(2026, 0, i).toISOString(), data: sample(i) });
    }

    importPlans(incoming);
    const plans = listPlans();
    expect(plans).toHaveLength(MAX_PLANS);
    // Newest incoming entry first; the oldest (local) plan was trimmed
    expect(plans[0].id).toBe(`cloud-${MAX_PLANS + 1}`);
    expect(plans.some((p) => p.id === localId)).toBe(false);
    // Active id was repaired after the original active plan got trimmed
    expect(getActivePlan().id).toBe(plans[0].id);
  });

  it('ignores malformed entries and empty input', () => {
    savePlan(sample(1));
    importPlans([{ id: null }, { nope: true }]);
    importPlans([]);
    importPlans(null);
    expect(listPlans()).toHaveLength(1);
  });
});

describe('sync handler notifications', () => {
  it('notifies on save, update, rename, and delete', () => {
    const events = [];
    setSyncHandler((type, payload) => events.push([type, payload.id]));

    const id = savePlan(sample(1));
    updatePlanData(id, sample(2));
    renamePlan(id, 'Renamed');
    deletePlan(id);

    expect(events.map(([type]) => type)).toEqual(['save', 'save', 'save', 'delete']);
    expect(new Set(events.map(([, eid]) => eid)).size).toBe(1);
  });

  it('a throwing handler never breaks local persistence', () => {
    setSyncHandler(() => {
      throw new Error('network down');
    });
    const id = savePlan(sample(1));
    expect(listPlans()[0].id).toBe(id);
  });
});

describe('cloud adapter', () => {
  it('maps save mutations to upserts with the user id attached', async () => {
    const client = makeStubClient();
    const entry = { id: 'abc', name: 'X', createdAt: '2026-01-01T00:00:00Z', data: sample(1) };

    await mirrorMutation('save', entry, 'user-1', client);
    expect(client.calls.upserts).toHaveLength(1);
    expect(client.calls.upserts[0]).toMatchObject({ id: 'abc', user_id: 'user-1', name: 'X' });
  });

  it('maps delete mutations to row deletes', async () => {
    const client = makeStubClient();
    await mirrorMutation('delete', { id: 'gone' }, 'user-1', client);
    expect(client.calls.deletes).toEqual(['gone']);
  });

  it('fullSync pushes local plans and merges cloud rows down', async () => {
    savePlan(sample(1));
    const cloudRows = [
      { id: 'cloud-9', name: 'From other device', created_at: new Date(2026, 5, 1).toISOString(), data: sample(9) },
    ];
    const client = makeStubClient(cloudRows);

    await fullSync('user-1', client);

    // Local plan was pushed up
    expect(client.calls.upserts).toHaveLength(1);
    expect(client.calls.upserts[0][0].user_id).toBe('user-1');
    // Cloud plan was merged down, newest first
    const plans = listPlans();
    expect(plans).toHaveLength(2);
    expect(plans[0].id).toBe('cloud-9');
    expect(plans[0].name).toBe('From other device');
  });

  it('does nothing without a client or user', async () => {
    await expect(mirrorMutation('save', { id: 'x' }, null, null)).resolves.toBeUndefined();
    await expect(fullSync(null, null)).resolves.toBeUndefined();
  });
});

describe('check-in cloud sync', () => {
  it('maps check-in saves to upserts on the checkins table', async () => {
    const client = makeTableStub();
    const entry = { id: 'c1', date: '2026-06-12', weight: 79.5, workoutsDone: ['Monday'] };

    await mirrorCheckinMutation('save', entry, 'user-1', client);
    expect(client.calls.upserts).toHaveLength(1);
    expect(client.calls.upserts[0].table).toBe('checkins');
    expect(client.calls.upserts[0].payload).toMatchObject({
      id: 'c1',
      user_id: 'user-1',
      date: '2026-06-12',
      weight: 79.5,
      workouts_done: ['Monday'],
    });
  });

  it('maps check-in deletes to row deletes', async () => {
    const client = makeTableStub();
    await mirrorCheckinMutation('delete', { id: 'c-gone' }, 'user-1', client);
    expect(client.calls.deletes).toEqual([{ table: 'checkins', id: 'c-gone' }]);
  });

  it('fullSync pushes local check-ins and merges cloud rows down', async () => {
    saveCheckin({ date: '2026-06-10', weight: 80, workoutsDone: [] });
    const client = makeTableStub({
      checkins: [
        { id: 'cloud-c', date: '2026-06-11', weight: 79.8, workouts_done: ['Tuesday'] },
      ],
    });

    await fullSync('user-1', client);

    const checkinUpserts = client.calls.upserts.filter((u) => u.table === 'checkins');
    expect(checkinUpserts).toHaveLength(1);
    expect(checkinUpserts[0].payload[0].user_id).toBe('user-1');

    const list = listCheckins();
    expect(list).toHaveLength(2);
    expect(list[1].id).toBe('cloud-c');
    expect(list[1].workoutsDone).toEqual(['Tuesday']);
  });
});
