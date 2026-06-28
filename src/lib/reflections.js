// reflections table must be created manually in Supabase:
//   id uuid default gen_random_uuid() primary key,
//   user_id uuid references auth.users not null,
//   reflection_text text not null,
//   streak_at integer,
//   created_at timestamptz default now()
// Enable RLS with policy: (auth.uid() = user_id)

import { supabase } from './supabase'

export async function saveReflection(userId, reflectionText, streakAt) {
  const { error } = await supabase.from('reflections').insert({
    user_id: userId,
    reflection_text: reflectionText,
    streak_at: streakAt,
  })
  if (error) throw error
}

export async function getReflectionCount(userId) {
  const { count, error } = await supabase
    .from('reflections')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) throw error
  return count || 0
}
