-- Run this in the Supabase SQL editor (Database > SQL Editor > New query).

create extension if not exists pgcrypto;

create table if not exists public.daily_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_at timestamptz not null default now(),
  action_text text not null,
  streak_count integer not null default 1
);

create index if not exists daily_actions_user_completed_at_idx
  on public.daily_actions (user_id, completed_at desc);

alter table public.daily_actions enable row level security;

create policy "Users can view their own daily actions"
  on public.daily_actions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own daily actions"
  on public.daily_actions
  for insert
  with check (auth.uid() = user_id);
