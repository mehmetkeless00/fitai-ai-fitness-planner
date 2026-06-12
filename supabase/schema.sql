-- FitFlow cloud plans schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).

create table if not exists public.plans (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now(),
  data jsonb not null
);

create index if not exists plans_user_id_idx on public.plans (user_id);

-- Row Level Security: users can only ever see and modify their own plans.
alter table public.plans enable row level security;

create policy "Users can read own plans"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can insert own plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update own plans"
  on public.plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own plans"
  on public.plans for delete
  using (auth.uid() = user_id);
