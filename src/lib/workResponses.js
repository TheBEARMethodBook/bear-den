import { supabase } from './supabase'

const CHAPTER_TOTALS = {
  1: 5, 2: 5, 3: 2, 4: 2, 5: 2,
  6: 3, 7: 3, 8: 5, 9: 4, 10: 4,
  11: 3, 12: 3,
}

export async function saveWorkResponse(userId, chapter, exerciseKey, response, completed) {
  const { error } = await supabase.from('work_responses').upsert(
    {
      user_id: userId,
      chapter,
      exercise_key: exerciseKey,
      response,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,chapter,exercise_key' }
  )
  if (error) throw error
}

export async function getWorkResponses(userId) {
  const { data, error } = await supabase
    .from('work_responses')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data || []
}

export function getChapterProgress(responses, chapter) {
  const total = CHAPTER_TOTALS[chapter] || 0
  const completed = responses.filter((r) => r.chapter === chapter && r.completed).length
  return { total, completed }
}
