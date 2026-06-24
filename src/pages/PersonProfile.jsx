import { useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import { BEAR_STAGES, RELATIONSHIP_TYPES, getInitials, updatePerson } from '../lib/people'
import { fetchInteractions } from '../lib/interactions'

const inputClass = 'rounded-lg border px-4 py-2 text-base outline-none focus:ring-2'
const inputStyle = { borderColor: '#1B2A4A', color: '#2E2E2E', backgroundColor: '#FFFFFF' }

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function formatDate(value) {
  if (!value) return ''
  // interacted_at is a calendar date with no meaningful time component, so pull the
  // Y/M/D digits straight off the string instead of letting the Date constructor treat
  // a UTC-midnight timestamp as an instant and shift it to the previous local day.
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (!dateMatch) return ''
  const [, year, month, day] = dateMatch
  const date = new Date(Number(year), Number(month) - 1, Number(day))
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

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
        {label}
      </span>
      {children}
    </label>
  )
}

function PillPicker({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
            style={
              isActive
                ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
                : { backgroundColor: '#FFFFFF', color: '#1B2A4A', border: '1px solid #1B2A4A' }
            }
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function EditPersonPanel({ person, onCancel, onSaved }) {
  const [name, setName] = useState(person.name || '')
  const [relationshipType, setRelationshipType] = useState(
    RELATIONSHIP_TYPES.includes(person.relationship) ? person.relationship : RELATIONSHIP_TYPES[0]
  )
  const [bearStage, setBearStage] = useState(BEAR_STAGES.includes(person.stage) ? person.stage : 'Building')
  const [phone, setPhone] = useState(person.phone || '')
  const [email, setEmail] = useState(person.email || '')
  const [howWeMet, setHowWeMet] = useState(person.howWeMet || '')
  const [details, setDetails] = useState(person.details || '')
  const [importantDates, setImportantDates] = useState(person.importantDates || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || isSaving) return

    setIsSaving(true)
    setError('')
    try {
      const updated = await updatePerson(person.id, {
        name: trimmedName,
        relationshipType,
        bearStage,
        phone,
        email,
        howWeMet,
        details,
        importantDates,
      })
      setShowSuccess(true)
      onSaved(updated)
    } catch (err) {
      setError(err.message || 'Could not save your changes. Try again.')
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(27, 42, 74, 0.6)' }}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-[430px] flex-col rounded-t-3xl shadow-2xl"
        style={{ backgroundColor: '#FAF6EE' }}
      >
        <div className="flex shrink-0 items-center justify-center pt-3">
          <span className="h-1.5 w-10 rounded-full" style={{ backgroundColor: '#1B2A4A', opacity: 0.2 }} />
        </div>

        <div className="flex shrink-0 items-center justify-between px-5 pt-3">
          <h2 className="text-lg font-bold" style={{ color: '#1B2A4A' }}>
            Edit Profile
          </h2>
          {showSuccess && (
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
              style={{ backgroundColor: '#3F8F5C', color: '#FFFFFF' }}
            >
              Saved
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
                style={inputStyle}
                autoFocus
              />
            </Field>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                Relationship type
              </span>
              <PillPicker options={RELATIONSHIP_TYPES} value={relationshipType} onChange={setRelationshipType} />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                BEAR stage
              </span>
              <PillPicker options={BEAR_STAGES} value={bearStage} onChange={setBearStage} />
            </div>

            <Field label="Phone">
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Optional"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Optional"
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="How we met">
              <input
                type="text"
                value={howWeMet}
                onChange={(event) => setHowWeMet(event.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Details that matter">
              <textarea
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                rows={3}
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            <Field label="Important dates">
              <input
                type="text"
                value={importantDates}
                onChange={(event) => setImportantDates(event.target.value)}
                placeholder="Birthday, anniversary, etc."
                className={inputClass}
                style={inputStyle}
              />
            </Field>

            {error && (
              <p className="text-sm font-medium" style={{ color: '#B3261E' }}>
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-3 px-5 pb-6 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border py-3 text-sm font-bold uppercase tracking-wide"
            style={{ borderColor: '#1B2A4A', color: '#1B2A4A', backgroundColor: '#FFFFFF' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            {isSaving ? 'Saving' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PersonProfile({ person, onNavigate }) {
  const [interactions, setInteractions] = useState([])
  const [isLoading, setIsLoading] = useState(() => Boolean(person?.id))
  const [loadError, setLoadError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

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
          onClick={() => setIsEditing(true)}
          className="mt-7 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          Edit Profile
        </button>
      </main>

      {isEditing && (
        <EditPersonPanel
          person={person}
          onCancel={() => setIsEditing(false)}
          onSaved={(updatedPerson) => {
            onNavigate('personProfile', updatedPerson)
            setTimeout(() => setIsEditing(false), 1200)
          }}
        />
      )}
    </PhoneFrame>
  )
}
