import { useRef, useState } from 'react'
import { useAuth } from '../contexts/useAuth'
import PhoneFrame from '../components/PhoneFrame'
import { BEAR_STAGES, RELATIONSHIP_TYPES, insertPerson } from '../lib/people'

const EXTRACTION_SYSTEM_PROMPT = `You extract structured contact data from a free-form voice or text "brain dump" inside Bear Den, a relationship-keeping app. The BEAR stages mean: Restore (relationship has gone quiet or needs repair), Building (early-stage, still getting to know them), Engaging (actively connecting, relationship growing), Strong (deep, well-established relationship).

Read the user's brain dump and extract:
- name: their name as given
- relationship_type: the single best fit from exactly these options: Client, Colleague, Friend, Family, Mentor, Prospect, Community. If nothing fits clearly, use Community.
- how_we_met: a short phrase describing how the user knows them, or null if not mentioned
- details: a short paragraph capturing anything that matters — spouse or partner, kids, hobbies, challenges, interests — written in plain prose, or null if nothing was shared
- important_dates: any specific dates mentioned (birthdays, anniversaries, etc.) as plain text, or null if none mentioned
- bear_stage: the single best fit from exactly these options: Restore, Building, Engaging, Strong, based on tone and context. Default to Building if unclear.

Never invent facts that weren't in the brain dump. Leave a field null if it wasn't mentioned, except relationship_type and bear_stage, which always need a best-guess value from their lists.

Output format:
Return strict JSON only, with exactly these keys: name, relationship_type, how_we_met, details, important_dates, bear_stage. No markdown fences, no preamble, no explanation — just the JSON object.`

function buildExtractionMessage(brainDump) {
  return `Brain dump:\n"""${brainDump.trim()}"""`
}

function parseExtraction(text) {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')

  if (start === -1 || end === -1) {
    throw new Error('Your Wingman could not read that. Try again or use Quick Add.')
  }

  let parsed
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    throw new Error('Your Wingman could not read that. Try again or use Quick Add.')
  }

  return {
    name: typeof parsed.name === 'string' ? parsed.name.trim() : '',
    relationshipType: RELATIONSHIP_TYPES.includes(parsed.relationship_type) ? parsed.relationship_type : 'Community',
    howWeMet: typeof parsed.how_we_met === 'string' ? parsed.how_we_met.trim() : '',
    details: typeof parsed.details === 'string' ? parsed.details.trim() : '',
    importantDates: typeof parsed.important_dates === 'string' ? parsed.important_dates.trim() : '',
    bearStage: BEAR_STAGES.includes(parsed.bear_stage) ? parsed.bear_stage : 'Building',
  }
}

async function fetchExtraction(brainDump) {
  const response = await fetch('/api/wingman', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: buildExtractionMessage(brainDump) }],
      systemPrompt: EXTRACTION_SYSTEM_PROMPT,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error || 'Your Wingman hit a snag. Try again.')
  }

  return parseExtraction(data.text || '')
}

function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  return SpeechRecognition ? new SpeechRecognition() : null
}

const inputClass = 'rounded-lg border px-4 py-2 text-base outline-none focus:ring-2'
const inputStyle = { borderColor: '#1B2A4A', color: '#2E2E2E' }

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

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1B2A4A">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9Z" />
      <path d="M19 14l.9 2.8L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-1.2Z" />
    </svg>
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

function ExtractionPreview({ extracted, onChange, onConfirm, onStartOver, isSaving, error }) {
  const update = (key, value) => onChange({ ...extracted, [key]: value })

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: '#2E2E2E' }}>
        Here's what Wingman caught. Adjust anything before it goes in your Vault.
      </p>

      <Field label="Name">
        <input
          type="text"
          value={extracted.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder="Their name"
          className={inputClass}
          style={inputStyle}
          autoFocus
        />
      </Field>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
          Relationship
        </span>
        <PillPicker options={RELATIONSHIP_TYPES} value={extracted.relationshipType} onChange={(v) => update('relationshipType', v)} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
          BEAR Stage
        </span>
        <PillPicker options={BEAR_STAGES} value={extracted.bearStage} onChange={(v) => update('bearStage', v)} />
      </div>

      <Field label="How we met">
        <input
          type="text"
          value={extracted.howWeMet}
          onChange={(event) => update('howWeMet', event.target.value)}
          placeholder="e.g. Met at a conference last spring"
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="Details that matter">
        <textarea
          value={extracted.details}
          onChange={(event) => update('details', event.target.value)}
          placeholder="Spouse, kids, hobbies, challenges, interests…"
          rows={3}
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      <Field label="Important dates">
        <input
          type="text"
          value={extracted.importantDates}
          onChange={(event) => update('importantDates', event.target.value)}
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

      <button
        type="button"
        onClick={onConfirm}
        disabled={!extracted.name.trim() || isSaving}
        className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
        style={{ backgroundColor: '#3F8F5C', color: '#FFFFFF' }}
      >
        {isSaving ? 'Saving…' : 'Add to Vault'}
      </button>

      <button
        type="button"
        onClick={onStartOver}
        className="w-full rounded-full border py-2.5 text-sm font-semibold uppercase tracking-wide"
        style={{ borderColor: '#1B2A4A', color: '#1B2A4A' }}
      >
        Edit details from scratch
      </button>
    </div>
  )
}

function BrainDump({ onSaved }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [extracted, setExtracted] = useState(null)
  const recognitionRef = useRef(null)

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
      setText((prev) => (prev ? `${prev.trim()} ${transcript}` : transcript))
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
    setError('')
  }

  const handleParse = async () => {
    const trimmed = text.trim()
    if (!trimmed || isParsing) return
    setIsParsing(true)
    setError('')
    try {
      const result = await fetchExtraction(trimmed)
      setExtracted(result)
    } catch (err) {
      setError(err.message || 'Your Wingman hit a snag. Try again.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleConfirm = async () => {
    if (!user || !extracted?.name.trim() || isSaving) return
    setIsSaving(true)
    setError('')
    try {
      const saved = await insertPerson(user.id, extracted)
      onSaved(saved)
    } catch (err) {
      setError(err.message || 'Could not save to your Vault. Try again.')
      setIsSaving(false)
    }
  }

  if (extracted) {
    return (
      <ExtractionPreview
        extracted={extracted}
        onChange={setExtracted}
        onConfirm={handleConfirm}
        onStartOver={() => setExtracted(null)}
        isSaving={isSaving}
        error={error}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Tell me about them… their name, how you know them, anything you remember. Just talk."
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

      {error && (
        <p className="text-sm font-medium" style={{ color: '#B3261E' }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleParse}
        disabled={!text.trim() || isParsing}
        className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
        style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
      >
        <SparkleIcon />
        {isParsing ? 'Wingman is thinking…' : 'Let Wingman parse this'}
      </button>
    </div>
  )
}

function QuickAdd({ onSaved }) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [relationshipType, setRelationshipType] = useState('Friend')
  const [bearStage, setBearStage] = useState('Building')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || !user || isSaving) return

    setIsSaving(true)
    setError('')
    try {
      const saved = await insertPerson(user.id, {
        name: trimmedName,
        relationshipType,
        bearStage,
        phone,
        email,
        details: notes,
      })
      onSaved(saved)
    } catch (err) {
      setError(err.message || 'Could not save to your Vault. Try again.')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Name">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Their name"
          className={inputClass}
          style={inputStyle}
          autoFocus
        />
      </Field>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
          Relationship type
        </span>
        <select
          value={relationshipType}
          onChange={(event) => setRelationshipType(event.target.value)}
          className={inputClass}
          style={inputStyle}
        >
          {RELATIONSHIP_TYPES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
          BEAR Stage
        </span>
        <select value={bearStage} onChange={(event) => setBearStage(event.target.value)} className={inputClass} style={inputStyle}>
          {BEAR_STAGES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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

      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Anything worth remembering"
          rows={3}
          className={inputClass}
          style={inputStyle}
        />
      </Field>

      {error && (
        <p className="text-sm font-medium" style={{ color: '#B3261E' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!name.trim() || isSaving}
        className="mt-1 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
        style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
      >
        {isSaving ? 'Saving…' : 'Add to Vault'}
      </button>
    </form>
  )
}

export default function AddPerson({ onNavigate }) {
  const [mode, setMode] = useState('brainDump')

  const handleSaved = () => onNavigate('vault')

  return (
    <PhoneFrame>
      <header className="flex shrink-0 items-center gap-3 px-4 py-3" style={{ backgroundColor: '#1B2A4A' }}>
        <button type="button" onClick={() => onNavigate('vault')} aria-label="Back">
          <BackIcon />
        </button>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Add Person
        </span>
      </header>

      <div className="flex shrink-0 gap-2 px-4 pt-4">
        <button
          type="button"
          onClick={() => setMode('brainDump')}
          className="flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wide"
          style={
            mode === 'brainDump'
              ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
              : { backgroundColor: '#FFFFFF', color: '#1B2A4A', border: '1px solid #1B2A4A' }
          }
        >
          AI Brain Dump
        </button>
        <button
          type="button"
          onClick={() => setMode('quickAdd')}
          className="flex-1 rounded-full py-2 text-xs font-bold uppercase tracking-wide"
          style={
            mode === 'quickAdd'
              ? { backgroundColor: '#C9A227', color: '#1B2A4A' }
              : { backgroundColor: '#FFFFFF', color: '#1B2A4A', border: '1px solid #1B2A4A' }
          }
        >
          Quick Add
        </button>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-10">
        {mode === 'brainDump' ? <BrainDump onSaved={handleSaved} /> : <QuickAdd onSaved={handleSaved} />}
      </main>
    </PhoneFrame>
  )
}
