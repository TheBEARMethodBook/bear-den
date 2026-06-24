import { useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import { getInitials } from '../lib/people'
import { fetchInteractions } from '../lib/interactions'

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function formatDate(value) {
  if (!value) return ''
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value
  const date = new Date(isoDateOnly)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function DetailCard({ title, body, placeholder }) {
  return (
    <section className="mt-4">
      <h2 className="text-base font-bold" style={{ color: '#1B2A4A' }}>
        {title}
      </h2>
      <div className="mt-2 rounded-xl bg-white p-4 shadow-sm">
        <p className="text-sm leading-snug" style={{ color: body ? '#2E2E2E' : '#9CA8C2' }}>
          {body || placeholder}
        </p>
      </div>
    </section>
  )
}

export default function PersonProfile({ person, onNavigate }) {
  const [interactions, setInteractions] = useState([])
  const [isLoading, setIsLoading] = useState(() => Boolean(person?.id))
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!person?.id) return
    let cancelled = false

    fetchInteractions(person.id)
      .then((rows) => {
        if (!cancelled) {
          setInteractions(rows)
          setLoadError('')
        }
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message || 'Could not load interactions.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [person?.id, person?.refreshedAt])

  if (!person) return null

  const hasPhone = Boolean(person.phone)

  return (
    <PhoneFrame>
      <header
        className="relative flex shrink-0 flex-col items-center gap-2 px-4 pb-6 pt-4"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <button
          type="button"
          onClick={() => onNavigate('vault')}
          aria-label="Back"
          className="absolute left-4 top-4"
        >
          <BackIcon />
        </button>

        <div
          className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          {getInitials(person.name)}
        </div>

        <p className="mt-1 text-xl font-bold text-white">{person.name}</p>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: '#C9A227' }}>
            {person.relationship}
          </span>
          <span
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: person.dot, color: '#FFFFFF' }}
          >
            {person.stage}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-10">
        <div className="flex shrink-0 gap-2">
          <a
            href={hasPhone ? `sms:${person.phone}` : undefined}
            aria-disabled={!hasPhone}
            className="flex-1 rounded-full py-2.5 text-center text-xs font-bold uppercase tracking-wide shadow-md"
            style={{
              backgroundColor: '#C9A227',
              color: '#1B2A4A',
              opacity: hasPhone ? 1 : 0.5,
              pointerEvents: hasPhone ? 'auto' : 'none',
            }}
          >
            Text
          </a>
          <a
            href={hasPhone ? `tel:${person.phone}` : undefined}
            aria-disabled={!hasPhone}
            className="flex-1 rounded-full py-2.5 text-center text-xs font-bold uppercase tracking-wide shadow-md"
            style={{
              backgroundColor: '#1B2A4A',
              color: '#FFFFFF',
              opacity: hasPhone ? 1 : 0.5,
              pointerEvents: hasPhone ? 'auto' : 'none',
            }}
          >
            Call
          </a>
          <button
            type="button"
            onClick={() => onNavigate('logInteraction', person)}
            className="flex-1 rounded-full border py-2.5 text-xs font-bold uppercase tracking-wide"
            style={{ borderColor: '#1B2A4A', color: '#1B2A4A', backgroundColor: '#FFFFFF' }}
          >
            Log Interaction
          </button>
        </div>

        <DetailCard title="Details that matter" body={person.details} placeholder="Nothing added yet." />
        <DetailCard title="Important dates" body={person.importantDates} placeholder="No dates saved yet." />
        <DetailCard title="How we met" body={person.howWeMet} placeholder="Not recorded yet." />

        <section className="mt-4">
          <h2 className="text-base font-bold" style={{ color: '#1B2A4A' }}>
            Interaction timeline
          </h2>

          <div className="mt-2 flex flex-col gap-3">
            {isLoading && (
              <p className="text-sm" style={{ color: '#9CA8C2' }}>
                Loading…
              </p>
            )}

            {!isLoading && loadError && (
              <p className="text-sm" style={{ color: '#B3261E' }}>
                {loadError}
              </p>
            )}

            {!isLoading && !loadError && interactions.length === 0 && (
              <p className="text-sm" style={{ color: '#9CA8C2' }}>
                No interactions logged yet. Tap Log Interaction to add one.
              </p>
            )}

            {!isLoading &&
              !loadError &&
              interactions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
                  style={{ borderColor: '#C9A227' }}
                >
                  <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                    {formatDate(interaction.interacted_at)}
                  </span>
                  <p className="mt-1 text-sm leading-snug" style={{ color: '#2E2E2E' }}>
                    {interaction.notes}
                  </p>
                </div>
              ))}
          </div>
        </section>

        <button
          type="button"
          className="mt-7 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          Edit Profile
        </button>
      </main>
    </PhoneFrame>
  )
}
