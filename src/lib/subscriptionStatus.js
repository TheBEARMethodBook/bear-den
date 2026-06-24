import { supabase } from './supabase'
import { toDateKey } from './dailyActions'

const TRIAL_LENGTH_DAYS = 30

async function ensureSubscriptionRow(userId) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  if (data) return data

  const { data: created, error: insertError } = await supabase
    .from('subscriptions')
    .insert({ user_id: userId, status: 'trial', trial_started_at: new Date().toISOString() })
    .select()
    .single()

  if (insertError) throw insertError

  return created
}

export async function isProUser(userId) {
  const subscription = await ensureSubscriptionRow(userId)
  return subscription.status === 'pro'
}

export async function isTrialActive(userId) {
  const subscription = await ensureSubscriptionRow(userId)
  if (!subscription.trial_started_at) return false

  const daysSinceTrialStart = (Date.now() - new Date(subscription.trial_started_at).getTime()) / 86400000
  return daysSinceTrialStart < TRIAL_LENGTH_DAYS
}

export async function getDaysActive(userId) {
  const { data, error } = await supabase
    .from('daily_actions')
    .select('completed_at')
    .eq('user_id', userId)

  if (error) throw error

  const dateKeys = new Set((data || []).map((row) => toDateKey(row.completed_at)))
  return dateKeys.size
}

export async function upgradeToPro(userId) {
  await ensureSubscriptionRow(userId)

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'pro', pro_started_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) throw error
}
