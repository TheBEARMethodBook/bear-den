-- Run this in the Supabase SQL editor (Database > SQL Editor > New query).

create extension if not exists pgcrypto;

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  notes text not null,
  interacted_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists interactions_person_interacted_at_idx
  on public.interactions (person_id, interacted_at desc);

alter table public.interactions enable row level security;

create policy "Users can view their own interactions"
  on public.interactions
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interactions"
  on public.interactions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own interactions"
  on public.interactions
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interactions"
  on public.interactions
  for delete
  using (auth.uid() = user_id);
