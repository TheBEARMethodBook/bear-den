import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const INITIAL_ENTRIES = [
  {
    date: 'Jun 16',
    chapter: 'Chapter 8',
    text: 'Reached out to someone I hadn’t talked to in months. No agenda, just said hello. It felt good to not need anything from the call.',
  },
  {
    date: 'Jun 13',
    chapter: 'Chapter 6',
    text: 'Noticed I was filling silence with reassurance again. Sat with it instead. Conversation actually went deeper.',
  },
  {
    date: 'Jun 9',
    chapter: 'Chapter 4',
    text: 'Asked for what I wanted directly instead of hinting. Uncomfortable for about ten seconds, then it was just normal.',
  },
  {
    date: 'Jun 5',
    chapter: 'Chapter 2',
    text: 'Caught myself over-explaining a decision that didn’t need defending. Stopped halfway through and let it stand.',
  },
]

function formatToday() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export default function Vault({ onNavigate }) {
  const [entries, setEntries] = useState(INITIAL_ENTRIES)
  const [isWriting, setIsWriting] = useState(false)
  const [chapter, setChapter] = useState('')
  const [text, setText] = useState('')

  const saveEntry = (event) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setEntries((prev) => [
      { date: formatToday(), chapter: chapter.trim() || 'Personal', text: trimmed },
      ...prev,
    ])
    setChapter('')
    setText('')
    setIsWriting(false)
  }

  if (isWriting) {
    return (
      <PhoneFrame>
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button type="button" onClick={() => setIsWriting(false)} aria-label="Back">
            <BackIcon />
          </button>
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            New Entry
          </span>
        </header>

        <form onSubmit={saveEntry} className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              Chapter (optional)
            </span>
            <input
              type="text"
              value={chapter}
              onChange={(event) => setChapter(event.target.value)}
              placeholder="e.g. Chapter 8"
              className="rounded-lg border px-4 py-2 text-base outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
            />
          </label>

          <label className="mt-4 flex flex-1 flex-col gap-1">
            <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
              What happened?
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write what you noticed, what you did, or how it felt…"
              className="flex-1 resize-none rounded-lg border px-4 py-3 text-base leading-snug outline-none focus:ring-2"
              style={{ borderColor: '#1B2A4A', color: '#2E2E2E', minHeight: '160px' }}
              autoFocus
            />
          </label>

          <button
            type="submit"
            disabled={!text.trim()}
            className="mt-5 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md disabled:opacity-60"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Save Entry
          </button>
        </form>
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
          Vault
        </span>
        <span className="text-xs font-semibold" style={{ color: '#9CA8C2' }}>
          {entries.length} reflections
        </span>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <p className="text-sm" style={{ color: '#2E2E2E' }}>
          Every action you mark done becomes a reflection here. Your record of who you're becoming.
        </p>

        <button
          type="button"
          onClick={() => setIsWriting(true)}
          className="mt-4 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
          style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
        >
          New Entry
        </button>

        <div className="mt-6 flex flex-col gap-3">
          {entries.map((entry, index) => (
            <div
              key={`${entry.date}-${index}`}
              className="rounded-xl border-l-4 bg-white p-4 shadow-sm"
              style={{ borderColor: '#C9A227' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: '#1B2A4A' }}>
                  {entry.date}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: '#FAF6EE', color: '#1B2A4A' }}
                >
                  {entry.chapter}
                </span>
              </div>
              <p className="mt-2 text-sm leading-snug" style={{ color: '#2E2E2E' }}>
                {entry.text}
              </p>
            </div>
          ))}
        </div>
      </main>

      <BottomNav activeTab="vault" onChange={onNavigate} />
    </PhoneFrame>
  )
}
