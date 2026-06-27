import { supabase } from './supabase'

export async function getDisplayName(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .maybeSingle()
  return data?.display_name ?? null
}

export async function upsertDisplayName(userId, displayName) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, display_name: displayName }, { onConflict: 'id' })
  if (error) throw error
}
