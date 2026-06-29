import { useEffect, useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'
import { saveWorkResponse, getWorkResponses, getChapterProgress } from '../lib/workResponses'

const CHAPTER_TITLES = {
  1: 'Reality Check: Your Position in the New World',
  2: 'Transaction vs Relationship Audit',
  3: 'The One Message Exercise',
  4: 'The Curiosity Conversation',
  5: 'The Honest Alternative',
  6: 'Restoration: Open the Door',
  7: 'Three Questions Worth Sitting With',
  8: 'Daily BEAR Practice',
  9: 'The Opportunity Audit',
  10: 'The Resilience Test',
  11: 'The Alignment Check',
  12: 'Your Digital Audit',
}

const EXERCISES = {
  1: [
    { key: 'ch1_automate', type: 'text', label: 'List 3 tasks in your job that could be automated.' },
    { key: 'ch1_human', type: 'text', label: 'List 3 parts of your role that require human trust or judgment.' },
    { key: 'ch1_advocates', type: 'text', label: 'Write down 5 people who would actively advocate for you today.', vaultLink: true },
    { key: 'ch1_call', type: 'text', label: 'If you lost your job tomorrow, who would you call first and why?' },
    { key: 'ch1_rating', type: 'text', label: 'Rate your current relationship depth from 1 to 10. What would it take to move it one point higher?' },
  ],
  2: [
    { key: 'ch2_contacts', type: 'text', label: 'List your top 10 professional contacts.' },
    { key: 'ch2_personal', type: 'text', label: 'For each contact, write one personal detail you know about them.' },
    { key: 'ch2_transactional', type: 'checkbox', label: 'Mark which relationships are transactional vs relational.' },
    { key: 'ch2_deepen', type: 'text', label: 'Identify 3 people you want to deepen a relationship with.' },
    { key: 'ch2_reach', type: 'checkbox', label: 'Reach out to one person this week with no agenda.' },
  ],
  3: [
    { key: 'ch3_three', type: 'text', label: 'Think of 3 people you have not contacted in longer than you intended. People you genuinely like and have simply lost touch with.' },
    { key: 'ch3_one', type: 'checkbox', label: 'Reach out to one of them today. One sentence. No agenda. Just: "I was thinking about you this week and wanted to say hello."' },
  ],
  4: [
    { key: 'ch4_conversation', type: 'checkbox', label: 'Choose one conversation this week. Ask at least one question you are genuinely curious about and listen to the entire answer before responding.' },
    { key: 'ch4_reflect', type: 'text', label: 'After the conversation: did the other person open up more than usual? What did you learn about them that you did not know?' },
  ],
  5: [
    { key: 'ch5_moment', type: 'checkbox', label: 'Notice one moment this week when you feel the pull toward inauthenticity. Choose the honest alternative instead.' },
    { key: 'ch5_reflect', type: 'text', label: 'What happened when you said the true thing? What did it cost you, and what did it build?' },
  ],
  6: [
    { key: 'ch6_role', type: 'text', label: 'Think of a relationship that needs restoration. What was your role in the breakdown?' },
    { key: 'ch6_reach', type: 'checkbox', label: 'Reach out with ownership and no defensiveness. Use language like: "I have been thinking about..." or "I could have handled that better."' },
    { key: 'ch6_focus', type: 'checkbox', label: 'Focus on repair, not being right.' },
  ],
  7: [
    { key: 'ch7_five', type: 'text', label: 'If you were to call 5 people right now, not to ask for anything, simply because you thought of them, who would they be?' },
    { key: 'ch7_reputation', type: 'text', label: 'When your name comes up in a conversation you are not part of, what do you believe people say? Not what you hope. What you genuinely believe.' },
    { key: 'ch7_legacy', type: 'text', label: 'What quality of relationship do you want to have cultivated when you look back from the far end of the life you are building now?' },
  ],
  8: [
    { key: 'ch8_appreciate', type: 'checkbox', label: 'Send one message of appreciation today.' },
    { key: 'ch8_present', type: 'checkbox', label: 'Be fully present in one conversation today.' },
    { key: 'ch8_question', type: 'checkbox', label: 'Ask one meaningful question today.' },
    { key: 'ch8_followup', type: 'checkbox', label: 'Follow up with one person today.' },
    { key: 'ch8_reflect', type: 'text', label: 'Did you build or withdraw today? What was the moment that defined it?' },
  ],
  9: [
    { key: 'ch9_opportunities', type: 'text', label: 'List 3 opportunities that came through people in your life.', vaultLink: true },
    { key: 'ch9_relationships', type: 'text', label: 'Identify the relationship behind each opportunity. What made that person go to bat for you?' },
    { key: 'ch9_without', type: 'text', label: 'What would your life look like without those three opportunities?' },
    { key: 'ch9_commit', type: 'text', label: 'Name 3 people you will commit to building that level of trust with now.' },
  ],
  10: [
    { key: 'ch10_imagine', type: 'text', label: 'Imagine losing your job tomorrow. Write what happens next, who you call, what you do, how it plays out.' },
    { key: 'ch10_gaps', type: 'text', label: 'Where are the gaps in your support system?' },
    { key: 'ch10_cost', type: 'text', label: 'What is the cost of those gaps right now, before anything goes wrong?' },
    { key: 'ch10_one', type: 'text', label: 'Name one relationship you will start building immediately.' },
  ],
  11: [
    { key: 'ch11_same', type: 'text', label: 'Are you the same person at work and at home? Where are you inconsistent, and what is driving that gap?' },
    { key: 'ch11_home', type: 'text', label: 'Identify 2 relationships at home to deepen.' },
    { key: 'ch11_work', type: 'text', label: 'Identify 2 relationships at work to deepen.' },
  ],
  12: [
    { key: 'ch12_audit', type: 'checkbox', label: 'Open your primary professional channel and review your last 20 interactions. For each ask: Did I engage with specificity or generically? Did I lead with curiosity about them or with what I needed? Did I close the loop or let it pass? Was anything I sent performative rather than genuine?' },
    { key: 'ch12_habits', type: 'text', label: 'What are the one or two habits you found that, if changed, would make the most difference?' },
    { key: 'ch12_fix', type: 'checkbox', label: 'Fix those two habits this week.' },
  ],
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function GoldCheck() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#C9A227" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export default function TheWork({ onNavigate, user }) {
  const [responses, setResponses] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [localTexts, setLocalTexts] = useState({})
  const [savedTexts, setSavedTexts] = useState({})

  useEffect(() => {
    if (!user) return
    getWorkResponses(user.id)
      .then((data) => {
        setResponses(data)
        const texts = {}
        for (const r of data) {
          if (r.response) texts[r.exercise_key] = r.response
        }
        setLocalTexts(texts)
        setSavedTexts({ ...texts })
      })
      .catch(() => {})
  }, [user])

  const handleCheckbox = async (chapter, exerciseKey, currentlyCompleted) => {
    const nextCompleted = !currentlyCompleted
    setResponses((prev) => {
      const exists = prev.find((r) => r.exercise_key === exerciseKey)
      if (exists) {
        return prev.map((r) =>
          r.exercise_key === exerciseKey ? { ...r, completed: nextCompleted } : r
        )
      }
      return [...prev, { chapter, exercise_key: exerciseKey, response: exerciseKey, completed: nextCompleted, user_id: user.id }]
    })
    try {
      await saveWorkResponse(user.id, chapter, exerciseKey, exerciseKey, nextCompleted)
    } catch {
      setResponses((prev) =>
        prev.map((r) =>
          r.exercise_key === exerciseKey ? { ...r, completed: currentlyCompleted } : r
        )
      )
    }
  }

  const handleTextSave = async (chapter, exerciseKey) => {
    const text = localTexts[exerciseKey] || ''
    const completed = text.trim().length > 0
    setSavedTexts((prev) => ({ ...prev, [exerciseKey]: text }))
    setResponses((prev) => {
      const exists = prev.find((r) => r.exercise_key === exerciseKey)
      if (exists) {
        return prev.map((r) =>
          r.exercise_key === exerciseKey ? { ...r, response: text, completed } : r
        )
      }
      return [...prev, { chapter, exercise_key: exerciseKey, response: text, completed, user_id: user.id }]
    })
    try {
      await saveWorkResponse(user.id, chapter, exerciseKey, text, completed)
    } catch {
      setSavedTexts((prev) => ({ ...prev, [exerciseKey]: savedTexts[exerciseKey] || '' }))
    }
  }

  if (selectedChapter) {
    const exercises = EXERCISES[selectedChapter] || []
    return (
      <PhoneFrame>
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button type="button" onClick={() => setSelectedChapter(null)} aria-label="Back">
            <BackIcon />
          </button>
          <span
            className="flex-1 pr-7 text-center text-base font-bold tracking-tight"
            style={{ color: '#C9A227' }}
          >
            {CHAPTER_TITLES[selectedChapter]}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4">
          {exercises.map((exercise) => {
            const responseRow = responses.find((r) => r.exercise_key === exercise.key)

            if (exercise.type === 'checkbox') {
              const isCompleted = responseRow?.completed || false
              return (
                <div key={exercise.key} className="mb-4">
                  <button
                    type="button"
                    onClick={() => handleCheckbox(selectedChapter, exercise.key, isCompleted)}
                    className="flex w-full items-start gap-3 text-left"
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                      style={{
                        borderColor: isCompleted ? '#C9A227' : '#1B2A4A',
                        backgroundColor: isCompleted ? '#C9A227' : 'transparent',
                      }}
                    >
                      {isCompleted && (
                        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#1B2A4A" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span className="text-sm leading-snug" style={{ color: '#2E2E2E' }}>
                      {exercise.label}
                    </span>
                  </button>
                </div>
              )
            }

            const currentText = localTexts[exercise.key] || ''
            const savedText = savedTexts[exercise.key] || ''
            const hasChanged = currentText !== savedText

            return (
              <div key={exercise.key} className="mb-6">
                <p className="mb-2 text-sm font-bold" style={{ color: '#1B2A4A' }}>
                  {exercise.label}
                </p>
                <textarea
                  value={currentText}
                  onChange={(e) =>
                    setLocalTexts((prev) => ({ ...prev, [exercise.key]: e.target.value }))
                  }
                  placeholder="Write your response…"
                  className="w-full resize-none rounded-lg border p-3 text-sm"
                  style={{
                    backgroundColor: '#FAF6EE',
                    borderColor: 'rgba(201,162,39,0.3)',
                    color: '#2E2E2E',
                    minHeight: '6rem',
                  }}
                />
                {exercise.vaultLink && (
                  <button
                    type="button"
                    onClick={() => onNavigate('vault')}
                    className="mt-1 text-xs"
                    style={{ color: '#1B2A4A' }}
                  >
                    Add these people to your Vault
                  </button>
                )}
                {hasChanged && (
                  <button
                    type="button"
                    onClick={() => handleTextSave(selectedChapter, exercise.key)}
                    className="mt-2 rounded-full px-4 py-2 text-sm font-bold"
                    style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
                  >
                    Save
                  </button>
                )}
              </div>
            )
          })}
        </main>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center gap-3 px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <button type="button" onClick={() => onNavigate('profile')} aria-label="Back">
          <BackIcon />
        </button>
        <span
          className="flex-1 pr-7 text-center text-lg font-bold tracking-tight"
          style={{ color: '#C9A227' }}
        >
          The Work
        </span>
      </header>

      <p className="mt-2 px-6 text-center text-sm" style={{ color: '#9CA8C2' }}>
        Do the exercises. Do the work.
      </p>

      <main className="flex-1 overflow-y-auto pb-6 pt-2">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((chapter) => {
          const { total, completed } = getChapterProgress(responses, chapter)
          const isComplete = total > 0 && completed === total
          const progressPercent = total > 0 ? (completed / total) * 100 : 0

          return (
            <button
              key={chapter}
              type="button"
              onClick={() => setSelectedChapter(chapter)}
              className="relative mx-4 mb-3 flex w-[calc(100%-2rem)] flex-col rounded-xl p-4 text-left shadow-sm"
              style={{ backgroundColor: '#FAF6EE' }}
            >
              {isComplete && (
                <span className="absolute right-3 top-3">
                  <GoldCheck />
                </span>
              )}
              <span className="text-xs font-bold tracking-widest" style={{ color: '#C9A227' }}>
                CHAPTER {chapter}
              </span>
              <span className="mt-1 pr-6 text-base font-bold" style={{ color: '#1B2A4A' }}>
                {CHAPTER_TITLES[chapter]}
              </span>
              <div className="mt-3 h-1.5 w-full rounded-full" style={{ backgroundColor: '#E5DDD0' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${progressPercent}%`, backgroundColor: '#C9A227' }}
                />
              </div>
              <span className="mt-1.5 text-xs" style={{ color: '#9CA8C2' }}>
                {completed === 0 ? 'Not started' : `${completed} of ${total} complete`}
              </span>
            </button>
          )
        })}
      </main>
    </PhoneFrame>
  )
}
