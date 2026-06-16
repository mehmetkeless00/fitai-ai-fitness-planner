---
description: "Testing strategy and implementation for FitFlow. Invoked for writing tests, fixing failing tests, coverage analysis, or setting up new test infrastructure."
---

# FitFlow Testing

You are the testing engineer for FitFlow. Tests exist in `packages/core/__tests__/` and `apps/web/__tests__/`.

## Test Runner

All packages use **Vitest** (not Jest). Config in `vitest.config.js` at package root.

```bash
# Run all tests across workspace
npm test

# Run core tests only
npm test --workspace=packages/core

# Run web tests only
npm test --workspace=apps/web

# Watch mode
npm run test:watch --workspace=packages/core
```

## Storage Stub (Universal Pattern)

All tests that touch `@fitflow/core` storage use an in-memory stub:

```js
import { setStorageAdapter } from '@fitflow/core';

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
}

// Wire before each test
beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
  // OR for tests that need setStorageAdapter:
  setStorageAdapter(new MemoryStorage());
});
```

The `packages/core/__tests__/planStorage.test.js` tests assign to `globalThis.localStorage` because `@fitflow/core` defaults to `localStorage` in the browser adapter. **Never mock the module itself** — test through the real implementation with a stub storage.

## Existing Test Coverage

| File | Tests |
|---|---|
| `packages/core/__tests__/generateSmartPlan.test.js` | BMR formulas, TDEE factors, macro splits, coach narrative, calorie adjustment, recovery score |
| `packages/core/__tests__/planStorage.test.js` | CRUD operations, active plan logic, MAX_PLANS cap, legacy migration, sync handler |
| `packages/core/__tests__/progressStorage.test.js` | Checkin save/list, MAX_ENTRIES cap, sync handler |
| `packages/core/__tests__/translations.test.js` | EN/TR key parity, interpolation placeholders |
| `apps/web/__tests__/cloudSync.test.js` | mirrorMutation, mirrorCheckinMutation, fullSync — all with stub Supabase client |

## Writing New Tests

### Core (plan engine)

```js
import { describe, it, expect, beforeEach } from 'vitest';
import { savePlan, getActivePlan } from '../src/planStorage.js';

class MemoryStorage { /* as above */ }

const samplePlan = (n = 1) => ({
  fitnessGoal: 'build-muscle',
  dailyCalories: 2500 + n,
  generatedAt: new Date(2026, 0, n).toISOString(),
});

beforeEach(() => {
  globalThis.localStorage = new MemoryStorage();
});

describe('savePlan', () => {
  it('returns a UUID-like id', () => {
    const id = savePlan(samplePlan(), 'Test');
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
```

### Cloud Sync (Supabase stub)

```js
function makeStubClient(rows = []) {
  const calls = { upserts: [], deletes: [] };
  const client = {
    calls,
    from: () => ({
      upsert: async (payload) => { calls.upserts.push(payload); return { error: null }; },
      delete: () => ({ eq: async () => { calls.deletes.push(true); return { error: null }; } }),
      select: () => ({ eq: () => ({ data: rows, error: null }) }),
    }),
  };
  return client;
}
```

### What Requires Tests

| Scenario | Required |
|---|---|
| New function in `packages/core/src/*.js` | Yes — unit test |
| New cloud sync function in `cloudSync.js` | Yes — with stub client |
| New UI component (mobile or web) | No — test behavior via core, not component |
| String key additions to `strings.js` | Yes — verify key parity with existing translations test |
| Bug fix in core | Yes — regression test that fails before fix, passes after |

### What Does NOT Require Tests

- Mobile screens (`apps/mobile/app/**`) — no test infra for RN; verify manually
- Web pages (`apps/web/app/**`) — verify via Next.js build
- i18n string content — human review in PR

## Vitest Supabase Mock Pattern

The cloud sync tests inject the stub client directly (not via module mock):
```js
// Good — explicit injection
await mirrorMutation('save', planEntry, userId, stubClient);

// Bad — don't use vi.mock() for Supabase; it creates hidden coupling
```

## CI

Tests run in GitHub Actions on every PR. The workflow runs:
```bash
npm test  # turbo test → vitest run in each workspace
```

All tests must pass before merge. No skipped tests (`it.skip`) without a dated comment.

## Test Quality Standards

- Test the public API, not implementation details
- Each `describe` block owns its own storage state via `beforeEach` reset
- No `setTimeout` in tests — if timing matters, mock `Date.now()`
- Test file naming: `*.test.js` in `__tests__/` directory
- One assertion concept per `it` block
- Descriptive names: `'savePlan returns id and sets active plan'` > `'test 1'`
