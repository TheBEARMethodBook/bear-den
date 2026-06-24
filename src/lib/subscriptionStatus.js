import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { toDateKey } from './dailyActions'

const TRIAL_LENGTH_DAYS = 30
const DEBUG_FORCE_EXPIRED_KEY = 'bearden_dev_force_trial_expired'

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

// Shared check used by every Pro-gated feature: Vault cap, interaction logging cap,
// Why This Works, Garden actions, and the Wingman tab. needsProAccess is true once a
// user's free trial has lapsed without upgrading.
//
// TEMPORARY: includes a testing override via the bearden_dev_force_trial_expired
// localStorage flag, with no environment guard, so the gates can be exercised in any
// build. Remove this flag before final launch.
export function useProAccess(user) {
  const [state, setState] = useState({ loaded: false, isPro: false, trialActive: true })

  useEffect(() => {
    if (!user) return
    let cancelled = false

    Promise.all([isProUser(user.id), isTrialActive(user.id)])
      .then(([isPro, trialActive]) => {
        if (!cancelled) setState({ loaded: true, isPro, trialActive })
      })
      .catch(() => {
        if (!cancelled) setState({ loaded: true, isPro: false, trialActive: true })
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const debugForceExpired = localStorage.getItem(DEBUG_FORCE_EXPIRED_KEY) === 'true'
  const needsProAccess = debugForceExpired || (state.loaded && !state.isPro && !state.trialActive)

  const markAsPro = () => setState((prev) => ({ ...prev, isPro: true }))

  return { ...state, needsProAccess, markAsPro }
}
