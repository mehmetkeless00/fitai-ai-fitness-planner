import { describe, it, expect, beforeEach } from 'vitest';
import {
  listCheckins,
  getCheckin,
  saveCheckin,
  deleteCheckin,
  importCheckins,
  setProgressSyncHandler,
  MAX_ENTRIES,
} from '../utils/progressStorage.js';

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

const day = (n) => `2026-${String(Math.floor(n / 28) + 1).padStart(2, '0')}-${String((n % 28) + 1).padStart(2, '0')}`;

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
  setProgressSyncHandler(null);
});

describe('saveCheckin / listCheckins', () => {
  it('creates entries and lists them oldest first', () => {
    saveCheckin({ date: '2026-06-12', weight: 80, workoutsDone: ['Monday'] });
    saveCheckin({ date: '2026-06-10', weight: 80.5, workoutsDone: [] });

    const list = listCheckins();
    expect(list.map((c) => c.date)).toEqual(['2026-06-10', '2026-06-12']);
    expect(list[1].workoutsDone).toEqual(['Monday']);
  });

  it('upserts by date: one entry per day, id preserved', () => {
    const id1 = saveCheckin({ date: '2026-06-12', weight: 80, workoutsDone: [] });
    const id2 = saveCheckin({ date: '2026-06-12', weight: 79.5, workoutsDone: ['Monday'] });

    expect(id2).toBe(id1);
    expect(listCheckins()).toHaveLength(1);
    expect(getCheckin('2026-06-12').weight).toBe(79.5);
    expect(getCheckin('2026-06-12').workoutsDone).toEqual(['Monday']);
  });

  it('keeps an existing weight when a later save omits it', () => {
    saveCheckin({ date: '2026-06-12', weight: 80, workoutsDone: [] });
    saveCheckin({ date: '2026-06-12', weight: null, workoutsDone: ['Friday'] });
    expect(getCheckin('2026-06-12').weight).toBe(80);
  });

  it(`caps at ${MAX_ENTRIES} entries, dropping the oldest`, () => {
    for (let i = 0; i < MAX_ENTRIES + 5; i++) {
      saveCheckin({ date: day(i), weight: 80, workoutsDone: [] });
    }
    const list = listCheckins();
    expect(list).toHaveLength(MAX_ENTRIES);
    expect(list[0].date).toBe(day(5));
  });

  it('ignores saves without a date', () => {
    expect(saveCheckin({ weight: 80 })).toBeNull();
    expect(listCheckins()).toEqual([]);
  });
});

describe('resilience', () => {
  it('returns empty for corrupted data', () => {
    localStorage.setItem('fitflow.progress.v1', '{broken');
    expect(listCheckins()).toEqual([]);
  });

  it('works without storage (SSR)', () => {
    delete globalThis.localStorage;
    expect(listCheckins()).toEqual([]);
    expect(() => saveCheckin({ date: '2026-06-12', weight: 80 })).not.toThrow();
  });
});

describe('sync notifications', () => {
  it('notifies on save and delete; throwing handlers are contained', () => {
    const events = [];
    setProgressSyncHandler((type) => events.push(type));

    const id = saveCheckin({ date: '2026-06-12', weight: 80, workoutsDone: [] });
    deleteCheckin(id);
    expect(events).toEqual(['save', 'delete']);

    setProgressSyncHandler(() => {
      throw new Error('boom');
    });
    expect(() => saveCheckin({ date: '2026-06-13', weight: 80 })).not.toThrow();
    expect(getCheckin('2026-06-13')).not.toBeNull();
  });
});

describe('importCheckins (cloud merge)', () => {
  it('dedupes by id and by date, incoming wins', () => {
    saveCheckin({ date: '2026-06-12', weight: 80, workoutsDone: [] });
    importCheckins([
      { id: 'cloud-1', date: '2026-06-12', weight: 79, workoutsDone: ['Monday'] },
      { id: 'cloud-2', date: '2026-06-11', weight: 80.2, workoutsDone: [] },
    ]);

    const list = listCheckins();
    expect(list).toHaveLength(2);
    expect(getCheckin('2026-06-12').id).toBe('cloud-1');
    expect(getCheckin('2026-06-12').weight).toBe(79);
  });

  it('filters malformed entries and tolerates empty input', () => {
    importCheckins([{ id: 'x' }, { date: 'y' }, null]);
    importCheckins(null);
    expect(listCheckins()).toEqual([]);
  });
});
