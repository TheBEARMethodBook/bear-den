import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { countInteractionsThisMonth } from '../lib/interactions'
import { getDaysActive, upgradeToPro } from '../lib/subscriptionStatus'
import { PRICING_PLANS } from '../lib/pricingPlans'

const VAULT_FREE_LIMIT = 15
const MONTHLY_FREE_LIMIT = 3

function SparkleIcon({ size = 40 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#C9A227">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9Z" />
      <path d="M19 14l.9 2.8L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-1.2Z" />
    </svg>
  )
}

function StatItem({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold" style={{ color: '#C9A227' }}>
        {value}
      </span>
      <span className="mt-1 text-center text-xs" style={{ color: '#9CA8C2' }}>
        {label}
      </span>
    </div>
  )
}

function LimitRow({ text, current, max }) {
  const percent = Math.min(100, Math.round((current / max) * 100))
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-white">{text}</p>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: '#1B2A4A' }}>
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: '#C9A227' }} />
      </div>
    </div>
  )
}

function PlanCard({ plan, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      className="relative w-full rounded-2xl p-4 text-left"
      style={{
        backgroundColor: '#FFFFFF',
        border: isSelected ? '2px solid #C9A227' : '2px solid transparent',
      }}
    >
      {plan.badge && (
        <span
          className="absolute -top-3 right-4 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          {plan.badge}
        </span>
      )}
      <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
        {plan.name}
      </p>
      <p className="mt-1 text-2xl font-bold" style={{ color: '#1B2A4A' }}>
        {plan.price}
        <span className="text-sm font-medium" style={{ color: '#9CA8C2' }}>
          {plan.period}
        </span>
      </p>
    </button>
  )
}

async function fetchStats(userId) {
  const [daysActive, peopleResult, interactionsThisMonth] = await Promise.all([
    getDaysActive(userId),
    supabase.from('people').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    countInteractionsThisMonth(userId),
  ])

  if (peopleResult.error) throw peopleResult.error

  return {
    daysActive,
    peopleCount: peopleResult.count || 0,
    interactionsThisMonth,
  }
}

export default function Upgrade({ user, onContinue }) {
  const [stats, setStats] = useState({ daysActive: 0, peopleCount: 0, interactionsThisMonth: 0 })
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false

    fetchStats(user.id)
      .then((result) => {
        if (!cancelled) setStats(result)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [user])

  const handleUpgrade = async () => {
    if (!user || isUpgrading) return
    setIsUpgrading(true)
    setError('')
    try {
      await upgradeToPro(user.id)
      onContinue()
    } catch (err) {
      setError(err.message || 'Could not complete your upgrade. Try again.')
      setIsUpgrading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="flex h-screen w-full max-w-[430px] flex-col overflow-y-auto px-6 py-10">
        <div className="flex flex-col items-center text-center">
          <SparkleIcon />
          <h1 className="mt-5 text-2xl font-bold leading-snug text-white">
            Your first 30 days are complete.
          </h1>
          <p className="mt-2 text-base font-semibold" style={{ color: '#C9A227' }}>
            You've built something real. Keep it going.
          </p>
        </div>

        <div className="mt-7 rounded-2xl p-4" style={{ backgroundColor: '#2E3F63' }}>
          <StatItem value={stats.daysActive} label="Days active" />
          <LimitRow
            text={`Your Vault: ${stats.peopleCount} of ${VAULT_FREE_LIMIT} people`}
            current={stats.peopleCount}
            max={VAULT_FREE_LIMIT}
          />
          <LimitRow
            text={`Interactions this month: ${stats.interactionsThisMonth} of ${MONTHLY_FREE_LIMIT}`}
            current={stats.interactionsThisMonth}
            max={MONTHLY_FREE_LIMIT}
          />
        </div>

        <div className="mt-7 flex flex-col gap-4">
          {PRICING_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} isSelected={selectedPlan === plan.id} onSelect={setSelectedPlan} />
          ))}
        </div>

        {error && (
          <p className="mt-4 text-center text-sm font-medium" style={{ color: '#F2B8B5' }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="mt-7 w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
          style={{ backgroundColor: '#1B2A4A', color: '#C9A227', border: '1px solid #C9A227' }}
        >
          {isUpgrading ? 'Setting up your Den…' : 'Get the Full Den'}
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="mt-4 text-sm font-medium"
          style={{ color: '#9CA8C2' }}
        >
          Maybe later
        </button>

        <p className="mt-8 text-center text-xs leading-relaxed" style={{ color: '#9CA8C2' }}>
          Your Vault and your data are yours forever, on any plan.
        </p>
      </div>
    </div>
  )
}
