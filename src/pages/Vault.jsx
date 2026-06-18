import BottomNav from '../components/BottomNav'

const ENTRIES = [
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

export default function Vault({ onNavigate }) {
  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#FAF6EE' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col">
        <header
          className="flex shrink-0 items-center justify-between px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
            Vault
          </span>
          <span className="text-xs font-semibold" style={{ color: '#9CA8C2' }}>
            {ENTRIES.length} reflections
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
          <p className="text-sm" style={{ color: '#2E2E2E' }}>
            Every action you mark done becomes a reflection here. Your record of who you're becoming.
          </p>

          <button
            type="button"
            className="mt-4 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            New Entry
          </button>

          <div className="mt-6 flex flex-col gap-3">
            {ENTRIES.map((entry) => (
              <div
                key={entry.date}
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
      </div>
    </div>
  )
}
