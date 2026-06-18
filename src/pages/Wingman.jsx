import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const SCRIPTS = [
  {
    name: 'No-agenda check-in',
    description: 'Reach out without asking for anything back.',
    draft: "Hey — you crossed my mind today. No reason, just wanted to say hi. Hope things are good on your end.",
  },
  {
    name: 'Follow up after meeting someone',
    description: 'Turn a first conversation into a real connection.',
    draft: "Really enjoyed talking with you the other day. Would love to keep the conversation going sometime soon.",
  },
  {
    name: 'Congratulations note',
    description: "Celebrate someone's win without making it about you.",
    draft: "Just heard the news — congratulations. You earned this one. Genuinely happy for you.",
  },
  {
    name: 'Repair and restoration text',
    description: "Reopen a relationship that's gone quiet or strained.",
    draft: "It's been a while since we talked, and I think about that. No pressure, but I'd like to reconnect if you're open to it.",
  },
  {
    name: 'Hard-season check-in',
    description: 'Show up for someone going through something tough.',
    draft: "I know things have been heavy lately. Not looking for a response, just want you to know I'm thinking of you.",
  },
  {
    name: 'Close the loop thank you',
    description: 'Acknowledge help you received, clearly and briefly.',
    draft: "Wanted to circle back and say thank you — what you did made a real difference. Didn't want that to go unsaid.",
  },
]

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
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script.draft)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

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

        <div
          className="mt-4 rounded-2xl p-5 shadow-lg"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <p className="text-base leading-relaxed text-white">{script.draft}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="mt-5 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          {copied ? 'Copied' : 'Copy to Clipboard'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-3 w-full rounded-full border py-3 text-sm font-semibold uppercase tracking-wide"
          style={{ borderColor: '#C9A227', color: '#1B2A4A' }}
        >
          Try Another Script
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
            draft: `Here's a starting point based on what you described: "${trimmed}." Keep what feels true, cut what doesn't.`,
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
