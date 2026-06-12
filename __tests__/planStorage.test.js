import { describe, it, expect, beforeEach } from 'vitest';
import {
  listPlans,
  getPlan,
  getActivePlan,
  savePlan,
  setActivePlan,
  renamePlan,
  updatePlanData,
  deletePlan,
  MAX_PLANS,
} from '../utils/planStorage.js';

const STORE_KEY = 'fitflow.plans.v2';
const LEGACY_KEY = 'userPlan';

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

const samplePlan = (n = 1) => ({
  fitnessGoal: 'build-muscle',
  dailyCalories: 2500 + n,
  generatedAt: new Date(2026, 0, n).toISOString(),
});

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
});

describe('savePlan / listPlans', () => {
  it('saves a plan, newest first, and marks it active', () => {
    const id1 = savePlan(samplePlan(1));
    const id2 = savePlan(samplePlan(2));

    const plans = listPlans();
    expect(plans).toHaveLength(2);
    expect(plans[0].id).toBe(id2);
    expect(getActivePlan().id).toBe(id2);
    expect(getPlan(id1).data.dailyCalories).toBe(2501);
  });

  it(`keeps at most ${MAX_PLANS} plans, dropping the oldest`, () => {
    const ids = [];
    for (let i = 1; i <= MAX_PLANS + 2; i++) {
      ids.push(savePlan(samplePlan(i)));
    }
    const plans = listPlans();
    expect(plans).toHaveLength(MAX_PLANS);
    expect(plans[0].id).toBe(ids.at(-1));
    expect(plans.some((p) => p.id === ids[0])).toBe(false);
  });
});

describe('legacy migration', () => {
  it('migrates the old single-plan key into the versioned store once', () => {
    localStorage.setItem(LEGACY_KEY, JSON.stringify(samplePlan(5)));

    const plans = listPlans();
    expect(plans).toHaveLength(1);
    expect(plans[0].data.dailyCalories).toBe(2505);
    expect(getActivePlan().id).toBe(plans[0].id);
    // Legacy key is consumed and the v2 store is persisted
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORE_KEY)).v).toBe(2);
  });

  it('drops corrupted legacy data without crashing', () => {
    localStorage.setItem(LEGACY_KEY, '{not json');
    expect(listPlans()).toEqual([]);
    expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
  });
});

describe('corruption resilience', () => {
  it('returns an empty store for corrupted v2 data', () => {
    localStorage.setItem(STORE_KEY, '%%%');
    expect(listPlans()).toEqual([]);
  });

  it('rejects schemas with the wrong version shape', () => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ v: 99, plans: 'nope' }));
    expect(listPlans()).toEqual([]);
  });

  it('works without any storage available (SSR)', () => {
    delete globalThis.localStorage;
    expect(listPlans()).toEqual([]);
    expect(getActivePlan()).toBeNull();
    expect(() => savePlan(samplePlan())).not.toThrow();
  });
});

describe('rename / delete / active selection', () => {
  it('renames a plan and treats blank names as unset', () => {
    const id = savePlan(samplePlan());
    renamePlan(id, '  Bulking Spring 2026  ');
    expect(getPlan(id).name).toBe('Bulking Spring 2026');

    renamePlan(id, '   ');
    expect(getPlan(id).name).toBeNull();
  });

  it('deleting the active plan promotes the next one', () => {
    const id1 = savePlan(samplePlan(1));
    const id2 = savePlan(samplePlan(2));
    expect(getActivePlan().id).toBe(id2);

    deletePlan(id2);
    expect(getActivePlan().id).toBe(id1);

    deletePlan(id1);
    expect(getActivePlan()).toBeNull();
    expect(listPlans()).toEqual([]);
  });

  it('updatePlanData replaces plan data in place (used by meal/exercise swaps)', () => {
    const id = savePlan(samplePlan(1));
    updatePlanData(id, { ...samplePlan(1), dailyCalories: 9999 });
    expect(getPlan(id).data.dailyCalories).toBe(9999);

    // Unknown ids are a no-op
    updatePlanData('ghost', { dailyCalories: 1 });
    expect(listPlans()).toHaveLength(1);
  });

  it('setActivePlan ignores unknown ids', () => {
    const id = savePlan(samplePlan());
    setActivePlan('does-not-exist');
    expect(getActivePlan().id).toBe(id);
  });
});
