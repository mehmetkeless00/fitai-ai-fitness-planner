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
import { mirrorMutation, fullSync } from '../utils/cloudSync.js';

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
});

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
