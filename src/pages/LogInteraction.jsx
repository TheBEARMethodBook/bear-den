import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import PhoneFrame from '../components/PhoneFrame'
import UpgradeBanner from '../components/UpgradeBanner'
import { countInteractionsThisMonth, insertInteraction } from '../lib/interactions'
import { updateLastContacted } from '../lib/people'
import { upgradeToPro, useProAccess } from '../lib/subscriptionStatus'

const MONTHLY_FREE_LIMIT = 3

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  return SpeechRecognition ? new SpeechRecognition() : null
}

function todayISODate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function MicIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  )
}

export default function LogInteraction({ person, onNavigate }) {
  const { user } = useAuth()
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState(todayISODate())
  const [isListening, setIsListening] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [monthlyCount, setMonthlyCount] = useState(null)
  const recognitionRef = useRef(null)
  const proAccess = useProAccess(user)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    countInteractionsThisMonth(user.id)
      .then((count) => {
        if (!cancelled) setMonthlyCount(count)
      })
      .catch(() => {
        if (!cancelled) setMonthlyCount(0)
      })

    return () => {
      cancelled = true
    }
  }, [user])

  const isCapped = monthlyCount !== null && monthlyCount >= MONTHLY_FREE_LIMIT && proAccess.needsProAccess

  const handleCapUpgrade = async () => {
    try {
      await upgradeToPro(user.id)
      proAccess.markAsPro()
    } catch {
      // Keep the banner open on failure so the user can retry.
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = getSpeechRecognition()
    if (!recognition) {
      setError('Voice input is not supported in this browser. Try typing instead.')
      return
    }

    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      setNotes((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript))
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setError('')
  }

  const handleSave = async () => {
    const trimmed = notes.trim()
    if (!trimmed || !user || !person?.id || isSaving) return

    setIsSaving(true)
    setError('')
    try {
      await insertInteraction(user.id, person.id, trimmed, date)
      await updateLastContacted(person.id)
      onNavigate('personProfile', { ...person, lastContacted: 'Just now', refreshedAt: Date.now() })
    } catch (err) {
      setError(err.message || 'Could not save that interaction. Try again.')
      setIsSaving(false)
    }
  }

  if (!person) return null

  return (
    <PhoneFrame>
      <header className="flex shrink-0 items-center gap-3 px-4 py-3" style={{ backgroundColor: '#1B2A4A' }}>
        <button type="button" onClick={() => onNavigate('personProfile', person)} aria-label="Back">
          <BackIcon />
        </button>
        <div>
          <span className="block text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            Log Interaction
          </span>
          <span className="block text-xs" style={{ color: '#9CA8C2' }}>
            {person.name}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-10">
        {monthlyCount === null ? (
          <p className="text-sm" style={{ color: '#9CA8C2' }}>
            Loading…
          </p>
        ) : isCapped ? (
          <p className="text-sm" style={{ color: '#9CA8C2' }}>
            You've reached your monthly interaction limit.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="What happened? Who did you reach out to, what did you talk about, how did it go?"
                rows={8}
                className="w-full rounded-2xl border px-4 py-3 pr-16 text-base leading-relaxed outline-none focus:ring-2"
                style={{ borderColor: '#1B2A4A', color: '#2E2E2E', backgroundColor: '#FFFFFF' }}
                autoFocus
              />
              <button
                type="button"
                onClick={handleMicClick}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full shadow-md"
                style={{ backgroundColor: isListening ? '#1B2A4A' : '#C9A227' }}
              >
                <MicIcon color={isListening ? '#C9A227' : '#1B2A4A'} />
              </button>
            </div>

            {isListening && (
              <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C9A227' }}>
                Listening…
              </p>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
                style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
              />
            </label>

            {error && (
              <p className="text-sm font-medium" style={{ color: '#B3261E' }}>
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={!notes.trim() || isSaving}
              className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
              style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
            >
              {isSaving ? 'Saving…' : 'Save Interaction'}
            </button>
          </div>
        )}
      </main>

      <UpgradeBanner
        isOpen={isCapped}
        onClose={() => onNavigate('personProfile', person)}
        onUpgrade={handleCapUpgrade}
        message="You've logged 3 interactions this month. Pro members log unlimited. Keep the momentum going."
      />
    </PhoneFrame>
  )
}
