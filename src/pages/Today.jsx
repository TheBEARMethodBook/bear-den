import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'
import UpgradeBanner from '../components/UpgradeBanner'
import { getActionForDay, getStreakStatus, recordDailyAction } from '../lib/dailyActions'
import { upgradeToPro, useProAccess } from '../lib/subscriptionStatus'

function getGreetingName(user) {
  const fullName = user?.user_metadata?.full_name
  if (fullName) return fullName.split(' ')[0]
  if (user?.email) return user.email.split('@')[0]
  return 'there'
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function getInitials(user) {
  const fullName = user?.user_metadata?.full_name
  if (fullName) return fullName[0].toUpperCase()
  if (user?.email) return user.email[0].toUpperCase()
  return '?'
}

function FlameIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={color}>
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5 2 1 3.5 3.5 3.5 6A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.5c0-4 2.5-6 3.5-8.5.5 1.5 1 2 1.5 2C10.5 5 11 3.5 12 2Z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function SparkleIcon({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#C9A227">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9Z" />
      <path d="M19 14l.9 2.8L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-1.2Z" />
    </svg>
  )
}

function celebrationSubMessage({ streak, isFirstEver }) {
  if (isFirstEver) {
    return "You just did what most people never do. You reached out with nothing to gain."
  }
  if (streak === 7) {
    return "Seven days of intentional connection. Your relationships feel the difference."
  }
  if (streak === 30) {
    return "Thirty days. You didn't just read about this. You lived it."
  }
  return null
}

function CelebrationOverlay({ streak, isFirstEver, onDismiss }) {
  const subMessage = celebrationSubMessage({ streak, isFirstEver })

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center px-8 text-center"
      style={{ backgroundColor: '#1B2A4A' }}
    >
      <SparkleIcon size={56} />
      <p className="mt-6 text-7xl font-bold leading-none" style={{ color: '#C9A227' }}>
        {streak}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#C9A227' }}>
        {streak === 1 ? 'Day Streak' : 'Day Streak'}
      </p>
      <p className="mt-8 text-xl font-bold text-white">You're becoming IMPOSSIBLE to replace.</p>
      {subMessage && (
        <p className="mt-4 text-base leading-relaxed" style={{ color: '#FAF6EE' }}>
          {subMessage}
        </p>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="mt-10 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
        style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
      >
        Dismiss
      </button>
    </div>
  )
}

export default function Today({ onNavigate }) {
  const { user } = useAuth()
  const [actionDone, setActionDone] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [streak, setStreak] = useState(0)
  const [marking, setMarking] = useState(false)
  const [markError, setMarkError] = useState('')
  const [celebration, setCelebration] = useState(null)
  const [showWhyUpgradeBanner, setShowWhyUpgradeBanner] = useState(false)
  const proAccess = useProAccess(user)

  const name = getGreetingName(user)
  const dayNumber = streak + (actionDone ? 0 : 1)
  const todaysAction = getActionForDay(dayNumber)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    getStreakStatus(user.id)
      .then(({ streak: currentStreak, completedToday }) => {
        if (cancelled) return
        setStreak(currentStreak)
        setActionDone(completedToday)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [user])

  const handleWhyThisWorksTap = () => {
    if (proAccess.needsProAccess) {
      setShowWhyUpgradeBanner(true)
    } else {
      setShowWhy(true)
    }
  }

  const handleWhyUpgrade = async () => {
    try {
      await upgradeToPro(user.id)
      proAccess.markAsPro()
    } catch {
      return
    }
    setShowWhyUpgradeBanner(false)
  }

  const handleMarkDone = async () => {
    if (!user || actionDone || marking) return
    setMarking(true)
    setMarkError('')

    try {
      const { streak: newStreak, isFirstEver } = await recordDailyAction(user.id, todaysAction.action)
      setStreak(newStreak)
      setActionDone(true)
      setCelebration({ streak: newStreak, isFirstEver })
    } catch (err) {
      setMarkError(err.message || 'Could not save your progress. Try again.')
    } finally {
      setMarking(false)
    }
  }

  if (showWhy) {
    return (
      <PhoneFrame>
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button type="button" onClick={() => setShowWhy(false)} aria-label="Back">
            <BackIcon />
          </button>
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            Why This Works
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#C9A227' }}
          >
            Week {todaysAction.week} · {todaysAction.theme}
          </span>

          <p className="mt-3 text-sm leading-relaxed" style={{ color: '#2E2E2E' }}>
            {todaysAction.why_it_works}
          </p>

          <div
            className="mt-5 rounded-xl border-l-4 bg-white p-4 shadow-sm"
            style={{ borderColor: '#C9A227' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              {todaysAction.chapter}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowWhy(false)}
            className="mt-6 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Back to Today
          </button>
        </main>

        <BottomNav activeTab="today" onChange={onNavigate} />
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          The BEAR Den
        </span>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ backgroundColor: '#C9A227' }}
          >
            <FlameIcon color="#1B2A4A" />
            <span className="text-xs font-bold" style={{ color: '#1B2A4A' }}>
              {streak} {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="Profile"
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: '#2E3F63', color: '#C9A227' }}
          >
            {getInitials(user)}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <h1 className="text-xl font-bold" style={{ color: '#1B2A4A' }}>
          {getGreeting()}, {name}
        </h1>

        <div
          className="mt-5 rounded-2xl p-5 shadow-lg"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#C9A227' }}
          >
            Day {dayNumber} · Week {todaysAction.week} · {todaysAction.theme}
          </span>
          <p className="mt-3 text-base font-medium leading-snug text-white">
            {todaysAction.action}
          </p>
          <p className="mt-2 text-sm" style={{ color: '#9CA8C2' }}>
            From {todaysAction.chapter}
          </p>

          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleMarkDone}
              disabled={actionDone || marking}
              className="rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
            >
              {actionDone ? 'Done for today' : marking ? 'Saving…' : 'Mark done'}
            </button>
            <button
              type="button"
              onClick={handleWhyThisWorksTap}
              className="rounded-full border py-3 text-sm font-semibold uppercase tracking-wide"
              style={{ borderColor: '#C9A227', color: '#C9A227' }}
            >
              Why this works
            </button>
          </div>

          {markError && (
            <p className="mt-3 text-sm font-medium" style={{ color: '#F2B8B5' }}>
              {markError}
            </p>
          )}
        </div>

        <section className="mt-7">
          <h2 className="text-base font-bold" style={{ color: '#1B2A4A' }}>
            Your den is nudging you
          </h2>

          <div className="mt-3 flex flex-col gap-3">
            <div
              className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
              style={{ borderColor: '#D9912E' }}
            >
              <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                Three days since your last Vault entry
              </p>
              <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
                A quick reflection keeps your momentum visible.
              </p>
            </div>

            <div
              className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
              style={{ borderColor: '#3F8F5C' }}
            >
              <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                Your Garden is ready to check in
              </p>
              <p className="mt-1 text-sm" style={{ color: '#2E2E2E' }}>
                Two relationships are due for a small act of care.
              </p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav activeTab="today" onChange={onNavigate} />

      {celebration && (
        <CelebrationOverlay
          streak={celebration.streak}
          isFirstEver={celebration.isFirstEver}
          onDismiss={() => setCelebration(null)}
        />
      )}

      <UpgradeBanner
        isOpen={showWhyUpgradeBanner}
        onClose={() => setShowWhyUpgradeBanner(false)}
        onUpgrade={handleWhyUpgrade}
        message="Chapter insights are part of the full Den. Upgrade to read the why behind every daily action."
      />
    </PhoneFrame>
  )
}
