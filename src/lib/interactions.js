import { supabase } from './supabase'

export async function fetchInteractions(personId) {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('person_id', personId)
    .order('interacted_at', { ascending: false })

  if (error) throw error

  return data || []
}

export async function countInteractionsThisMonth(userId) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { count, error } = await supabase
    .from('interactions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfMonth)

  if (error) throw error

  return count || 0
}

export async function insertInteraction(userId, personId, notes, interactedAt) {
  const { data, error } = await supabase
    .from('interactions')
    .insert({
      user_id: userId,
      person_id: personId,
      notes: notes.trim(),
      interacted_at: interactedAt,
    })
    .select()
    .single()

  if (error) throw error

  return data
}
