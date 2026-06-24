-- Run this in the Supabase SQL editor (Database > SQL Editor > New query).

create extension if not exists pgcrypto;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'trial' check (status in ('trial', 'free', 'pro')),
  trial_started_at timestamptz not null default now(),
  pro_started_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists subscriptions_user_id_key
  on public.subscriptions (user_id);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscription"
  on public.subscriptions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscription"
  on public.subscriptions
  for update
  using (auth.uid() = user_id);
