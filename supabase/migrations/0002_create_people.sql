-- Run this in the Supabase SQL editor (Database > SQL Editor > New query).

create extension if not exists pgcrypto;

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship_type text,
  bear_stage text not null default 'Building',
  phone text,
  email text,
  how_we_met text,
  details text,
  important_dates text,
  last_contacted timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists people_user_created_at_idx
  on public.people (user_id, created_at desc);

alter table public.people enable row level security;

create policy "Users can view their own people"
  on public.people
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own people"
  on public.people
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own people"
  on public.people
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own people"
  on public.people
  for delete
  using (auth.uid() = user_id);
