---
description: "Supabase integration and cloud sync for FitFlow. Invoked for auth, database schema, cloud sync logic, RLS policies, migration from local-only to cloud, or any Supabase-related task."
---

# FitFlow Supabase — Cloud Sync & Auth

You are the backend engineer for FitFlow's optional cloud sync layer. Local-first is non-negotiable.

## Architecture Principle

> Cloud sync is a **mirror** of local storage, never the source of truth.

The app works 100% offline. When Supabase is configured and a user is signed in, mutations are mirrored to the cloud as a fire-and-forget operation. Errors never surface to the user.

```
User action → Local storage (synchronous) → UI updates → Cloud mirror (async, background)
```

## Configuration

Supabase is optional. Set env vars in `apps/web/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

`lib/supabase.js`:
```js
export const isCloudEnabled = Boolean(url && anonKey);
export function getSupabase() { /* lazy singleton or null */ }
```

**Never throw if Supabase is unconfigured.** Always check `isCloudEnabled` before any Supabase call.

## Database Schema

```sql
-- Plans table
create table plans (
  id          uuid primary key,
  user_id     uuid references auth.users not null,
  name        text,
  created_at  timestamptz not null,
  data        jsonb not null,
  updated_at  timestamptz default now()
);

-- Checkins (progress) table
create table checkins (
  id           uuid primary key,
  user_id      uuid references auth.users not null,
  date         text not null,          -- 'YYYY-MM-DD'
  weight       real,                   -- always kg, nullable
  workouts_done text[] default '{}',
  created_at   timestamptz default now()
);

-- Row Level Security
alter table plans enable row level security;
alter table checkins enable row level security;

create policy "Users own their plans"    on plans    for all using (auth.uid() = user_id);
create policy "Users own their checkins" on checkins for all using (auth.uid() = user_id);
```

## Sync Handler Registration

In `cloudSync.js`, sync handlers are registered with `@fitflow/core` via the `setSyncHandler` / `setProgressSyncHandler` hooks:

```js
import { setSyncHandler, setProgressSyncHandler } from '@fitflow/core';

export function initCloudSync(userId) {
  setSyncHandler((type, payload) => mirrorMutation(type, payload, userId));
  setProgressSyncHandler((type, payload) => mirrorCheckinMutation(type, payload, userId));
}
```

**The sync handler must never throw** — core catches errors but the handler should be silent:
```js
export async function mirrorMutation(type, payload, userId, client = getSupabase()) {
  if (!client || !userId) return;
  try {
    if (type === 'save') {
      await client.from('plans').upsert(toRow(payload, userId));
    } else if (type === 'delete') {
      await client.from('plans').delete().eq('id', payload.id);
    }
  } catch (err) {
    console.error('Cloud sync failed:', err);  // log only, never rethrow
  }
}
```

## Full Sync on Sign-In

When a user signs in, do a full sync: local → cloud AND cloud → local (merge strategy: most-recent wins by `created_at`):

```js
export async function fullSync(userId, client = getSupabase()) {
  if (!client || !userId) return;
  const localPlans = listPlans();
  const { data: cloudPlans } = await client.from('plans').select('*').eq('user_id', userId);
  // Upsert all local plans to cloud
  for (const plan of localPlans) {
    await client.from('plans').upsert(toRow(plan, userId));
  }
  // Import cloud-only plans locally
  const localIds = new Set(localPlans.map(p => p.id));
  const remoteOnly = (cloudPlans || []).filter(r => !localIds.has(r.id));
  if (remoteOnly.length) importPlans(remoteOnly.map(toEntry));
}
```

## Auth Flow

1. User visits `/auth` (only shown if `isCloudEnabled`)
2. Supabase magic link or OAuth → session stored in browser
3. `AuthProvider` calls `initCloudSync(userId)` on session change
4. `fullSync()` runs once on first sign-in

The mobile app does NOT yet have auth UI. Cloud sync is web-only until Phase 18+.

## Mobile Cloud Sync (Future)

When mobile cloud sync is implemented:
1. Install `@supabase/supabase-js` in `apps/mobile/package.json`
2. Create `apps/mobile/lib/supabase.js` (same pattern as web)
3. Add `fitflow.userId` to `FITFLOW_KEYS` in `asyncAdapter.js`
4. Call `initCloudSync()` from `_layout.js` after storage init, gated on stored userId
5. **Do NOT change `@fitflow/core` storage functions** — the sync handler hook already works on mobile

## Security Rules

- All Supabase calls use the **anon key** client-side + RLS policies — never the service role key in client code
- `user_id` in all rows is set server-side via `auth.uid()` in RLS; the client just passes the session
- Plan `data` column is JSONB — no PII beyond what the user explicitly entered

## Testing Pattern

Use the stub client pattern (see `apps/web/__tests__/cloudSync.test.js`):
```js
function makeStubClient(rows = []) {
  const calls = { upserts: [], deletes: [] };
  // ... returns an object mirroring Supabase client shape
}
// Inject directly — never mock the Supabase module
await mirrorMutation('save', entry, userId, makeStubClient());
```

## Environment Variables

```bash
# Required for cloud features
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Not needed — app runs fully local without these
```

Never commit `.env.local`. The app must work without these variables set.
