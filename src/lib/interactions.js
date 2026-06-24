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
