import { useState } from 'react'
import BottomNav from '../components/BottomNav'

const QUICK_PROMPTS = [
  'Help me respond to a text',
  'Talk through a hard conversation',
  'I froze up today, what now?',
]

const INITIAL_MESSAGES = [
  {
    from: 'wingman',
    text: "I'm your Wingman. Tell me what's going on and we'll figure out the next move together.",
  },
]

export default function Wingman({ onNavigate }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')

  const sendMessage = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((prev) => [
      ...prev,
      { from: 'user', text: trimmed },
      {
        from: 'wingman',
        text: "Got it. I'm just a preview right now, but soon I'll help you work through this in real time.",
      },
    ])
    setDraft('')
  }

  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col">
        <header
          className="flex shrink-0 items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            Wingman
          </span>
          <span className="text-xs font-semibold" style={{ color: '#9CA8C2' }}>
            Always in your corner
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-4">
          <div className="flex flex-col gap-3">
            {messages.map((message, index) => {
              const isWingman = message.from === 'wingman'
              return (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-snug ${isWingman ? 'self-start' : 'self-end'}`}
                  style={
                    isWingman
                      ? { backgroundColor: '#1B2A4A', color: '#FAF6EE' }
                      : { backgroundColor: '#C9A227', color: '#1B2A4A' }
                  }
                >
                  {message.text}
                </div>
              )
            })}
          </div>

          {messages.length === 1 && (
            <div className="mt-5 flex flex-col gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border py-2.5 text-left text-sm font-medium"
                  style={{ borderColor: '#C9A227', color: '#1B2A4A', paddingLeft: '1rem' }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </main>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage(draft)
          }}
          className="mb-16 flex shrink-0 items-center gap-2 border-t bg-white px-4 py-3"
          style={{ borderColor: '#E5DFD2' }}
        >
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Tell your Wingman what's up…"
            className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2"
            style={{ borderColor: '#1B2A4A', color: '#2E2E2E' }}
          />
          <button
            type="submit"
            className="rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Send
          </button>
        </form>

        <BottomNav activeTab="wingman" onChange={onNavigate} />
      </div>
    </div>
  )
}
