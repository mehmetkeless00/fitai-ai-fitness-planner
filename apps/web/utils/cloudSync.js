// Mirrors the local plan store to Supabase for signed-in users.
// Local storage remains the source of truth; cloud writes are fire-and-forget
// so a flaky connection never blocks the UI.

import { getSupabase } from '../lib/supabase';
import { listPlans, importPlans, setSyncHandler } from '@fitflow/core';
import { listCheckins, importCheckins, setProgressSyncHandler } from '@fitflow/core';

function toRow(entry, userId) {
  return {
    id: entry.id,
    user_id: userId,
    name: entry.name,
    created_at: entry.createdAt,
    data: entry.data,
  };
}

function toEntry(row) {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    data: row.data,
  };
}

// Handles a single local mutation. Exported for tests (client injectable).
export async function mirrorMutation(type, payload, userId, client = getSupabase()) {
  if (!client || !userId) return;
  try {
    if (type === 'save') {
      await client.from('plans').upsert(toRow(payload, userId));
    } else if (type === 'delete') {
      await client.from('plans').delete().eq('id', payload.id);
    }
  } catch (err) {
    console.error('Cloud sync failed:', err);
  }
}

function toCheckinRow(entry, userId) {
  return {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    weight: entry.weight,
    workouts_done: entry.workoutsDone || [],
  };
}

function toCheckinEntry(row) {
  return {
    id: row.id,
    date: row.date,
    weight: row.weight,
    workoutsDone: row.workouts_done || [],
  };
}

// Handles a single check-in mutation. Exported for tests (client injectable).
export async function mirrorCheckinMutation(type, payload, userId, client = getSupabase()) {
  if (!client || !userId) return;
  try {
    if (type === 'save') {
      await client.from('checkins').upsert(toCheckinRow(payload, userId));
    } else if (type === 'delete') {
      await client.from('checkins').delete().eq('id', payload.id);
    }
  } catch (err) {
    console.error('Cloud sync failed:', err);
  }
}

// Two-way sync on login: push local data up, pull cloud data down, merge.
export async function fullSync(userId, client = getSupabase()) {
  if (!client || !userId) return;
  try {
    const localPlans = listPlans();
    if (localPlans.length > 0) {
      await client.from('plans').upsert(localPlans.map((e) => toRow(e, userId)));
    }
    const { data: planRows, error: planError } = await client
      .from('plans')
      .select('id, name, created_at, data')
      .order('created_at', { ascending: false });
    if (!planError && Array.isArray(planRows)) {
      importPlans(planRows.map(toEntry));
    }

    const localCheckins = listCheckins();
    if (localCheckins.length > 0) {
      await client.from('checkins').upsert(localCheckins.map((e) => toCheckinRow(e, userId)));
    }
    const { data: checkinRows, error: checkinError } = await client
      .from('checkins')
      .select('id, date, weight, workouts_done')
      .order('date', { ascending: false });
    if (!checkinError && Array.isArray(checkinRows)) {
      importCheckins(checkinRows.map(toCheckinEntry));
    }
  } catch (err) {
    console.error('Cloud sync failed:', err);
  }
}

// Wires local mutations to the cloud for the given user; call with null to stop.
export function enableCloudSync(userId) {
  if (!userId) {
    setSyncHandler(null);
    setProgressSyncHandler(null);
    return;
  }
  setSyncHandler((type, payload) => {
    mirrorMutation(type, payload, userId);
  });
  setProgressSyncHandler((type, payload) => {
    mirrorCheckinMutation(type, payload, userId);
  });
}
