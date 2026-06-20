import { supabase } from './supabase'

export const TODAY_ACTION_TEXT = 'Call someone you thought of recently. No agenda. Just say hello.'

function toDateKey(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(dateKey, delta) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + delta)
  return toDateKey(date)
}

function computeStreak(dateKeys, todayKey) {
  const completedToday = dateKeys.has(todayKey)
  let cursor = completedToday ? todayKey : addDays(todayKey, -1)

  let streak = 0
  while (dateKeys.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }

  return { streak, completedToday }
}

async function fetchCompletionDateKeys(userId) {
  const { data, error } = await supabase
    .from('daily_actions')
    .select('completed_at')
    .eq('user_id', userId)

  if (error) throw error

  return new Set((data || []).map((row) => toDateKey(row.completed_at)))
}

export async function getStreakStatus(userId) {
  const dateKeys = await fetchCompletionDateKeys(userId)
  const todayKey = toDateKey(new Date())
  const { streak, completedToday } = computeStreak(dateKeys, todayKey)

  return { streak, completedToday, isFirstEver: dateKeys.size === 0 }
}

export async function recordDailyAction(userId) {
  const dateKeys = await fetchCompletionDateKeys(userId)
  const todayKey = toDateKey(new Date())
  const isFirstEver = dateKeys.size === 0

  if (dateKeys.has(todayKey)) {
    const { streak } = computeStreak(dateKeys, todayKey)
    return { streak, isFirstEver: false }
  }

  dateKeys.add(todayKey)
  const { streak } = computeStreak(dateKeys, todayKey)

  const { error } = await supabase.from('daily_actions').insert({
    user_id: userId,
    action_text: TODAY_ACTION_TEXT,
    streak_count: streak,
  })

  if (error) throw error

  return { streak, isFirstEver }
}
