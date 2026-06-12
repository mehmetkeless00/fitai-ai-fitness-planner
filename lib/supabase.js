import { createClient } from '@supabase/supabase-js';

// Cloud sync is optional: without these env vars the app runs fully local-only
// (no sign-in UI, no network calls) — exactly as it did before Supabase existed.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isCloudEnabled = Boolean(url && anonKey);

let client = null;

export function getSupabase() {
  if (!isCloudEnabled) return null;
  if (!client) {
    client = createClient(url, anonKey);
  }
  return client;
}
