import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'
import UpgradeBanner from '../components/UpgradeBanner'
import { getActionForDay, getStreakStatus, recordDailyAction } from '../lib/dailyActions'
import { fetchPeople, fetchReachOutNudges } from '../lib/people'
import { supabase } from '../lib/supabase'
import { getDisplayName } from '../lib/profiles'
import { upgradeToPro, useProAccess } from '../lib/subscriptionStatus'
import { saveReflection as saveReflectionToDb } from '../lib/reflections'

const RECENTLY_CONTACTED_DAYS = 7

const isSunday = new Date().getDay() === 0

function getThisWeekKey() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diffToMonday)
  return d.toISOString().slice(0, 10)
}

function daysSinceContact(value) {
  if (!value) return null
  return Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
}

function formatDaysSinceContact(value) {
  const days = daysSinceContact(value)
  if (days === null) return 'Never contacted'
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function getGreetingName(user, profileName) {
  if (profileName) return profileName
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

const MONTH_NAMES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8,
  sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
}

function extractLabel(text, matchIndex) {
  const before = text.slice(0, matchIndex).trim()
  const m = before.match(/([A-Za-z]+)\s*[:,-]?\s*$/)
  return m ? m[1] : 'Date'
}

function parseUpcomingDates(people) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const results = []

  for (const person of people) {
    if (!person.importantDates) continue
    const text = person.importantDates
    const found = []

    // Match "March 15", "jan 3rd", "February 8th", etc.
    const monthNameRe = /([a-zA-Z]+)\s+(\d{1,2})(?:st|nd|rd|th)?/g
    let m
    while ((m = monthNameRe.exec(text)) !== null) {
      const monthNum = MONTH_NAMES[m[1].toLowerCase()]
      const day = parseInt(m[2], 10)
      if (!monthNum || day < 1 || day > 31) continue
      found.push({ monthNum, day, label: extractLabel(text, m.index) })
    }

    // Match "3/15", "03/15"
    const numericRe = /\b(\d{1,2})\/(\d{1,2})\b/g
    while ((m = numericRe.exec(text)) !== null) {
      const monthNum = parseInt(m[1], 10)
      const day = parseInt(m[2], 10)
      if (monthNum < 1 || monthNum > 12 || day < 1 || day > 31) continue
      found.push({ monthNum, day, label: extractLabel(text, m.index) })
    }

    for (const { monthNum, day, label } of found) {
      for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
        const candidate = new Date(today.getFullYear() + yearOffset, monthNum - 1, day)
        candidate.setHours(0, 0, 0, 0)
        const diffDays = Math.round((candidate - today) / 86400000)
        if (diffDays >= 0 && diffDays <= 7) {
          results.push({ personName: person.name, dateLabel: label, daysUntil: diffDays, person })
          break
        }
      }
    }
  }

  results.sort((a, b) => a.daysUntil - b.daysUntil)

  const seen = new Set()
  return results.filter(({ personName, dateLabel, daysUntil }) => {
    const key = `${personName}|${dateLabel}|${daysUntil}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function formatDaysUntil(label, daysUntil) {
  if (daysUntil === 0) return `${label} today`
  if (daysUntil === 1) return `${label} tomorrow`
  return `${label} in ${daysUntil} days`
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

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
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

function CelebrationOverlay({ streak, isFirstEver, onDismiss, reflection, onReflectionChange, onSaveReflection, reflectionSaved }) {
  const subMessage = celebrationSubMessage({ streak, isFirstEver })

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto px-8 py-10 text-center"
      style={{ backgroundColor: '#1B2A4A' }}
    >
      <SparkleIcon size={56} />
      <p className="mt-6 text-7xl font-bold leading-none" style={{ color: '#C9A227' }}>
        {streak}
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#C9A227' }}>
        Day Streak
      </p>
      <p className="mt-8 text-xl font-bold text-white">You're becoming IMPOSSIBLE to replace.</p>
      {subMessage && (
        <p className="mt-4 text-base leading-relaxed" style={{ color: '#FAF6EE' }}>
          {subMessage}
        </p>
      )}
      <div className="mt-6 w-full max-w-xs text-left">
        <p className="text-sm" style={{ color: '#C9A227', opacity: 0.8 }}>
          Who did you reach out to today? (optional)
        </p>
        <textarea
          rows={3}
          value={reflection}
          onChange={onReflectionChange}
          placeholder="A name, a note, anything..."
          className="mt-1 w-full resize-none rounded-lg border p-2 text-sm"
          style={{
            backgroundColor: 'rgba(27, 42, 74, 0.3)',
            borderColor: 'rgba(201, 162, 39, 0.3)',
            color: '#FAF6EE',
          }}
        />
        {reflection.trim().length > 0 && (
          <button
            type="button"
            onClick={onSaveReflection}
            className="mt-2 w-full rounded-full py-2 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Save Reflection
          </button>
        )}
        {reflectionSaved && (
          <p className="mt-1 text-center text-sm font-semibold" style={{ color: '#C9A227' }}>
            Saved.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-6 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
        style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
      >
        Dismiss
      </button>
    </div>
  )
}

function WeeklyRecapScreen({ streak, weeklyStats, onNavigate, onDismiss }) {
  const { weeklyInteractions, thriving, needsWater, wilting, mostOverdue } = weeklyStats || {}

  return (
    <PhoneFrame>
      <header
        className="relative flex shrink-0 items-center justify-center px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Weekly Recap
        </span>
        <button type="button" onClick={onDismiss} aria-label="Close recap" className="absolute right-4">
          <CloseIcon />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-10">
        <div className="flex justify-center">
          <SparkleIcon size={40} />
        </div>

        <p className="mt-4 text-center text-2xl font-bold" style={{ color: '#1B2A4A' }}>
          Here's how your week looked.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#FAF6EE' }}>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA8C2' }}>
              Relationships touched
            </p>
            <p className="mt-1 text-3xl font-bold" style={{ color: '#1B2A4A' }}>
              {weeklyInteractions ?? '--'}
            </p>
          </div>

          <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#FAF6EE' }}>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA8C2' }}>
              Current streak
            </p>
            <p className="mt-1 text-3xl font-bold" style={{ color: '#1B2A4A' }}>
              {streak}
            </p>
            <p className="text-xs" style={{ color: '#9CA8C2' }}>days</p>
          </div>

          <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#FAF6EE' }}>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA8C2' }}>
              Thriving
            </p>
            <p className="mt-1 text-3xl font-bold" style={{ color: '#2A7A3A' }}>
              {thriving ?? '--'}
            </p>
          </div>

          <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#FAF6EE' }}>
            {wilting > 0 ? (
              <>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA8C2' }}>
                  Wilting
                </p>
                <p className="mt-1 text-3xl font-bold" style={{ color: '#B3261E' }}>
                  {wilting}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA8C2' }}>
                  Needs Water
                </p>
                <p className="mt-1 text-3xl font-bold" style={{ color: '#9A6B1E' }}>
                  {needsWater ?? '--'}
                </p>
              </>
            )}
          </div>
        </div>

        {mostOverdue && (
          <div className="mt-5 rounded-xl p-4 shadow-sm" style={{ backgroundColor: '#FAF6EE' }}>
            <p className="text-sm" style={{ color: '#9CA8C2' }}>
              Your most overdue connection
            </p>
            <p className="mt-1 text-base font-bold" style={{ color: '#1B2A4A' }}>
              {mostOverdue.name}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('wingman', mostOverdue)}
              className="mt-3 w-full rounded-full py-2.5 text-sm font-bold uppercase tracking-wide shadow-md"
              style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
            >
              Write a note
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#FAF6EE', color: '#1B2A4A' }}
        >
          Got it, let's go
        </button>
      </main>
    </PhoneFrame>
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
  const [nudges, setNudges] = useState([])
  const [nudgesLoading, setNudgesLoading] = useState(true)
  const [nudgesError, setNudgesError] = useState('')
  const [profileName, setProfileName] = useState(null)
  const [allPeople, setAllPeople] = useState([])
  const [allPeopleLoaded, setAllPeopleLoaded] = useState(false)
  const [reflection, setReflection] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false)
  const [weeklyStats, setWeeklyStats] = useState(null)
  const [wingmanNudgeDismissed, setWingmanNudgeDismissed] = useState(
    () => localStorage.getItem('bearden_wingman_nudge_dismissed') === 'true'
  )
  const proAccess = useProAccess(user)

  const name = getGreetingName(user, profileName)
  const dayNumber = streak + (actionDone ? 0 : 1)
  const todaysAction = getActionForDay(dayNumber)

  useEffect(() => {
    if (!user) return
    getDisplayName(user.id).then((fetched) => { if (fetched) setProfileName(fetched) }).catch(() => {})
  }, [user])

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

  useEffect(() => {
    if (!user) return
    let cancelled = false

    fetchReachOutNudges(user.id)
      .then((rows) => {
        if (!cancelled) {
          setNudges(rows)
          setNudgesError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setNudgesError(err.message || 'Could not load your Vault.')
      })
      .finally(() => {
        if (!cancelled) setNudgesLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    fetchPeople(user.id)
      .then((rows) => {
        if (!cancelled) {
          setAllPeople(rows)
          setAllPeopleLoaded(true)
        }
      })
      .catch(() => { if (!cancelled) setAllPeopleLoaded(true) })
    return () => { cancelled = true }
  }, [user])

  useEffect(() => {
    if (!user) return
    if (!isSunday) return
    const key = `bearden_recap_dismissed_${getThisWeekKey()}`
    if (!localStorage.getItem(key)) {
      setShowWeeklyRecap(true)
    }
  }, [user])

  useEffect(() => {
    if (!showWeeklyRecap || !user || !allPeopleLoaded) return
    let cancelled = false

    ;(async () => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()
      const { count } = await supabase
        .from('interactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('interacted_at', sevenDaysAgo)

      if (cancelled) return

      const now = Date.now()
      let thriving = 0
      let needsWater = 0
      let wilting = 0

      for (const person of allPeople) {
        const contactDays = person.lastContactedAt
          ? Math.floor((now - new Date(person.lastContactedAt).getTime()) / 86400000)
          : null
        const createdDays = person.createdAt
          ? Math.floor((now - new Date(person.createdAt).getTime()) / 86400000)
          : 0
        const effectiveDays = contactDays !== null ? contactDays : createdDays
        if (effectiveDays <= 14) thriving++
        else if (effectiveDays <= 30) needsWater++
        else wilting++
      }

      // Sort by effective date: use last_contacted if available, fall back to created_at.
      // Oldest effective date = most overdue = first in list.
      const sorted = [...allPeople].sort((a, b) => {
        const aEffective = new Date(a.lastContactedAt || a.createdAt || Date.now())
        const bEffective = new Date(b.lastContactedAt || b.createdAt || Date.now())
        return aEffective - bEffective
      })

      setWeeklyStats({
        weeklyInteractions: count || 0,
        thriving,
        needsWater,
        wilting,
        mostOverdue: sorted[0] || null,
      })
    })()

    return () => { cancelled = true }
  }, [showWeeklyRecap, user, allPeople, allPeopleLoaded])

  // nudges is sorted longest-since-contact first (nulls first), so checking just the
  // first entry tells us whether everyone is within the recently-contacted window.
  const mostOverdueDays = daysSinceContact(nudges[0]?.lastContactedAt)
  const everyoneRecentlyContacted =
    nudges.length > 0 && mostOverdueDays !== null && mostOverdueDays <= RECENTLY_CONTACTED_DAYS

  const upcomingDates = parseUpcomingDates(allPeople)

  const { trialActive, isPro, trialStartedAt } = proAccess
  const isDay14Nudge = trialActive && trialStartedAt && !isPro && (() => {
    const days = (Date.now() - new Date(trialStartedAt).getTime()) / 86400000
    return days >= 13 && days < 15
  })()
  const showWingmanNudge = isDay14Nudge && !wingmanNudgeDismissed

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

  const handleSaveReflection = async () => {
    if (!reflection.trim() || !celebration) return
    try {
      await saveReflectionToDb(user.id, reflection.trim(), celebration.streak)
      setReflection('')
      setReflectionSaved(true)
      setTimeout(() => setReflectionSaved(false), 2000)
    } catch {
      // reflection is optional — fail silently
    }
  }

  const dismissRecap = () => {
    const key = `bearden_recap_dismissed_${getThisWeekKey()}`
    localStorage.setItem(key, '1')
    setShowWeeklyRecap(false)
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

  if (showWeeklyRecap) {
    return (
      <WeeklyRecapScreen
        streak={streak}
        weeklyStats={weeklyStats}
        onNavigate={onNavigate}
        onDismiss={dismissRecap}
      />
    )
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
            Week {Math.ceil(dayNumber / 7)} · {todaysAction.theme}
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
            Day {dayNumber} · Week {Math.ceil(dayNumber / 7)} · {todaysAction.theme}
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

        {showWingmanNudge && (
          <div
            className="mt-5 rounded-xl p-4 shadow-sm"
            style={{ backgroundColor: '#FAF6EE', border: '1px solid rgba(201,162,39,0.4)' }}
          >
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C9A227' }}>
              Day 14 of your trial
            </p>
            <p className="mt-1 text-sm font-bold" style={{ color: '#1B2A4A' }}>
              You haven't tried your Wingman yet.
            </p>
            <p className="mt-1 text-sm" style={{ color: '#9CA8C2' }}>
              Let it draft something for someone in your Vault. One tap.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('wingman')}
              className="mt-3 w-full rounded-full py-2.5 text-sm font-bold uppercase tracking-wide shadow-md"
              style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
            >
              Try Wingman Now
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('bearden_wingman_nudge_dismissed', 'true')
                setWingmanNudgeDismissed(true)
              }}
              className="mt-2 w-full text-center text-xs"
              style={{ color: '#9CA8C2' }}
            >
              Dismiss
            </button>
          </div>
        )}

        {upcomingDates.length > 0 && (
          <section className="mt-7">
            <h2 className="text-base font-bold" style={{ color: '#1B2A4A' }}>
              Coming up
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              {upcomingDates.map((item, index) => (
                <button
                  key={`${item.personName}-${item.dateLabel}-${index}`}
                  type="button"
                  onClick={() => onNavigate('personProfile', item.person)}
                  className="flex items-center gap-3 rounded-xl bg-white p-3 text-left shadow-sm"
                >
                  <CalendarIcon />
                  <div className="min-w-0">
                    <p className="text-sm font-bold" style={{ color: '#C9A227' }}>
                      {item.personName}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: '#9CA8C2' }}>
                      {formatDaysUntil(item.dateLabel, item.daysUntil)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-7">
          <h2 className="text-base font-bold" style={{ color: '#1B2A4A' }}>
            Who's on your mind today?
          </h2>

          <div className="mt-3 flex flex-col gap-3">
            {nudgesLoading && (
              <p className="text-sm" style={{ color: '#9CA8C2' }}>
                Loading…
              </p>
            )}

            {!nudgesLoading && nudgesError && (
              <p className="text-sm" style={{ color: '#B3261E' }}>
                {nudgesError}
              </p>
            )}

            {!nudgesLoading && !nudgesError && nudges.length === 0 && (
              <p className="text-sm leading-relaxed" style={{ color: '#9CA8C2' }}>
                Add someone to your Vault and we'll remind you to stay connected.
              </p>
            )}

            {!nudgesLoading && !nudgesError && nudges.length > 0 && everyoneRecentlyContacted && (
              <p className="text-sm leading-relaxed" style={{ color: '#9CA8C2' }}>
                You're staying connected. Keep it up.
              </p>
            )}

            {!nudgesLoading &&
              !nudgesError &&
              nudges.length > 0 &&
              !everyoneRecentlyContacted &&
              nudges.map((person) => (
                <div
                  key={person.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate('personProfile', person)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate('personProfile', person) }}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 text-left shadow-sm cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold" style={{ color: '#C9A227' }}>
                      {person.name}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: '#9CA8C2' }}>
                      {person.relationship}
                    </p>
                    <p className="mt-1 text-xs font-medium" style={{ color: '#2E2E2E' }}>
                      {formatDaysSinceContact(person.lastContactedAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onNavigate('wingman', person) }}
                    className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold"
                    style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
                  >
                    Write a note
                  </button>
                </div>
              ))}
          </div>
        </section>
      </main>

      <BottomNav activeTab="today" onChange={onNavigate} />

      {celebration && (
        <CelebrationOverlay
          streak={celebration.streak}
          isFirstEver={celebration.isFirstEver}
          onDismiss={() => { setCelebration(null); setReflection(''); setReflectionSaved(false) }}
          reflection={reflection}
          onReflectionChange={(e) => setReflection(e.target.value)}
          onSaveReflection={handleSaveReflection}
          reflectionSaved={reflectionSaved}
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
