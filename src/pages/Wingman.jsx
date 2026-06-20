import { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const SCRIPTS = [
  {
    name: 'No-agenda check-in',
    description: 'Reach out without asking for anything back.',
    prompt: 'Write a no-agenda check-in text: reaching out to someone just because they crossed my mind, with no ask attached.',
  },
  {
    name: 'Follow up after meeting someone',
    description: 'Turn a first conversation into a real connection.',
    prompt: 'Write a follow-up text to someone I just met and enjoyed talking with, suggesting we keep the conversation going.',
  },
  {
    name: 'Congratulations note',
    description: "Celebrate someone's win without making it about you.",
    prompt: "Write a short congratulations text for someone's win, keeping the focus on them.",
  },
  {
    name: 'Repair and restoration text',
    description: "Reopen a relationship that's gone quiet or strained.",
    prompt: "Write a low-pressure text to reconnect with someone after a relationship has gone quiet or strained.",
  },
  {
    name: 'Hard-season check-in',
    description: 'Show up for someone going through something tough.',
    prompt: 'Write a check-in text for someone going through a hard season, with no expectation of a reply.',
  },
  {
    name: 'Close the loop thank you',
    description: 'Acknowledge help you received, clearly and briefly.',
    prompt: 'Write a brief, sincere thank-you text acknowledging help someone gave me.',
  },
]

const OPTION_ANGLE_INSTRUCTIONS = [
  null,
  'Write this as a second, alternative version of the same message. Give it a noticeably different opening line, tone, and angle than a first version would use, while staying grounded in the Bear Voice Engine principles.',
]

function buildVariationSeed() {
  return Math.random().toString(36).slice(2, 10)
}

async function fetchWingmanOption(basePrompt, { angleInstruction, isRetry, seed }) {
  const parts = [basePrompt]

  if (angleInstruction) parts.push(angleInstruction)

  if (isRetry) {
    parts.push(
      `Variation seed: ${seed}. Generate a completely different version from any previous response. Try a different opening, different tone, different angle — but always grounded in the BEAR Voice Engine principles.`
    )
  }

  const response = await fetch('/api/wingman', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: parts.join('\n\n') }],
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error || 'Your Wingman hit a snag. Try again.')
  }

  return data.text || ''
}

function emptyOption() {
  return { text: '', loading: true, error: '', copied: false }
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="#C9A227">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9Z" />
      <path d="M19 14l.9 2.8L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-1.2Z" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C9A227" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function MicIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
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

function Draft({ script, onBack }) {
  const [options, setOptions] = useState([emptyOption(), emptyOption()])
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    const isRetry = attempt > 0
    const seed = buildVariationSeed()

    setOptions([emptyOption(), emptyOption()])

    OPTION_ANGLE_INSTRUCTIONS.forEach((angleInstruction, index) => {
      fetchWingmanOption(script.prompt, { angleInstruction, isRetry, seed: `${seed}-${index}` })
        .then((text) => {
          if (cancelled) return
          setOptions((prev) => {
            const next = [...prev]
            next[index] = { text: text.trim(), loading: false, error: '', copied: false }
            return next
          })
        })
        .catch((err) => {
          if (cancelled) return
          setOptions((prev) => {
            const next = [...prev]
            next[index] = { text: '', loading: false, error: err.message || 'Your Wingman hit a snag. Try again.', copied: false }
            return next
          })
        })
    })

    return () => {
      cancelled = true
    }
  }, [script, attempt])

  const handleCopy = async (index) => {
    try {
      await navigator.clipboard.writeText(options[index].text)
      setOptions((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], copied: true }
        return next
      })
      setTimeout(() => {
        setOptions((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], copied: false }
          return next
        })
      }, 2000)
    } catch {
      // clipboard write failed; leave copied state untouched
    }
  }

  const anyLoading = options.some((option) => option.loading)

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center gap-3 px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <button type="button" onClick={onBack} aria-label="Back">
          <BackIcon />
        </button>
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          {script.name}
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-sm" style={{ color: '#2E2E2E' }}>
          Drafts the bones. You add the soul.
        </p>

        {anyLoading && (
          <p className="mt-6 text-center text-sm font-semibold" style={{ color: '#C9A227' }}>
            Your Wingman is thinking…
          </p>
        )}

        {!anyLoading && (
          <div className="mt-4 flex flex-col gap-4">
            {options.map((option, index) => (
              <div key={index}>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: '#9CA8C2' }}>
                  Option {index + 1}
                </p>

                {option.error ? (
                  <div className="rounded-2xl p-5" style={{ backgroundColor: '#FCEAEA' }}>
                    <p className="text-sm" style={{ color: '#8A1F1F' }}>{option.error}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl p-5 shadow-lg" style={{ backgroundColor: '#1B2A4A' }}>
                    <p className="text-base leading-relaxed text-white">{option.text}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleCopy(index)}
                  disabled={!!option.error}
                  className="mt-2 w-full rounded-full py-2.5 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-50"
                  style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
                >
                  {option.copied ? 'Copied' : `Copy Option ${index + 1}`}
                </button>
              </div>
            ))}
          </div>
        )}

        {!anyLoading && (
          <p className="mt-5 text-center text-sm font-semibold" style={{ color: '#C9A227' }}>
            Before you send this: add the one detail only you know.
          </p>
        )}

        <button
          type="button"
          onClick={() => setAttempt((value) => value + 1)}
          disabled={anyLoading}
          className="mt-5 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-50"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          Try Another Script
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 w-full rounded-full border py-3 text-sm font-semibold uppercase tracking-wide"
          style={{ borderColor: '#C9A227', color: '#1B2A4A' }}
        >
          Choose a Different Script
        </button>
      </main>
    </PhoneFrame>
  )
}

export default function Wingman({ onNavigate }) {
  const [selected, setSelected] = useState(null)
  const [customRequest, setCustomRequest] = useState('')

  if (selected) {
    return <Draft script={selected} onBack={() => setSelected(null)} />
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center gap-2 px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <SparkleIcon />
        <div>
          <p className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            Wingman
          </p>
          <p className="text-xs" style={{ color: '#9CA8C2' }}>
            Drafts the bones. You add the soul.
          </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <div
          className="rounded-full px-4 py-2 text-center text-xs font-semibold"
          style={{ backgroundColor: '#FCF0DA', color: '#9A6B1E' }}
        >
          5 assists remaining this month
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {SCRIPTS.map((script) => (
            <button
              key={script.name}
              type="button"
              onClick={() => setSelected(script)}
              className="flex items-center gap-3 rounded-xl bg-white p-4 text-left shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  {script.name}
                </p>
                <p className="mt-0.5 text-xs leading-snug" style={{ color: '#9CA8C2' }}>
                  {script.description}
                </p>
              </div>
              <ArrowIcon />
            </button>
          ))}
        </div>
      </main>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const trimmed = customRequest.trim()
          if (!trimmed) return
          setSelected({
            name: 'Custom request',
            description: trimmed,
            prompt: `Write a text message for this situation: "${trimmed}"`,
          })
          setCustomRequest('')
        }}
        className="mb-16 flex shrink-0 items-center gap-2 px-4 py-3"
        style={{ backgroundColor: '#C9A227' }}
      >
        <input
          type="text"
          value={customRequest}
          onChange={(event) => setCustomRequest(event.target.value)}
          placeholder="Or describe what you need…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#5C4A14]"
          style={{ color: '#1B2A4A' }}
        />
        <button
          type="submit"
          aria-label="Send voice or text request"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <MicIcon color="#C9A227" />
        </button>
      </form>

      <BottomNav activeTab="wingman" onChange={onNavigate} />
    </PhoneFrame>
  )
}
