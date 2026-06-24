import { useState } from 'react'

const TOTAL_SLIDES = 5
const SLIDE_WIDTH_PCT = 100 / TOTAL_SLIDES

function FlameIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#C9A227">
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5 2 1 3.5 3.5 3.5 6A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.5c0-4 2.5-6 3.5-8.5.5 1.5 1 2 1.5 2C10.5 5 11 3.5 12 2Z" />
    </svg>
  )
}

function PeopleIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#C9A227" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M15.7 14.3c2.6.5 4.3 2.7 4.3 5.7" />
    </svg>
  )
}

function SparkleIcon({ size = 24 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="#C9A227">
      <path d="M12 2l1.8 5.6L19 9.5l-5.2 1.9L12 17l-1.8-5.6L5 9.5l5.2-1.9Z" />
      <path d="M19 14l.9 2.8L22.5 18l-2.6.9L19 21.5l-.9-2.6L15.5 18l2.6-1.2Z" />
    </svg>
  )
}

function BearLogo() {
  return (
    <div
      className="flex h-28 w-28 items-center justify-center rounded-full shadow-2xl"
      style={{ backgroundColor: '#C9A227' }}
    >
      <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#1B2A4A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.2" cy="6.5" r="2.1" />
        <circle cx="16.8" cy="6.5" r="2.1" />
        <circle cx="12" cy="13" r="7" />
        <circle cx="12" cy="14.5" r="2.2" fill="#1B2A4A" stroke="none" />
      </svg>
    </div>
  )
}

function PracticeRow({ icon, text }) {
  return (
    <div className="flex items-start gap-4 text-left">
      <div
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: '#2E3F63' }}
      >
        {icon}
      </div>
      <p className="text-sm leading-relaxed text-white">{text}</p>
    </div>
  )
}

const slideWrapperClass = 'flex h-full shrink-0 flex-col items-center justify-center px-8 text-center'

export default function Onboarding({ onComplete, onAddPerson }) {
  const [step, setStep] = useState(0)

  const goTo = (index) => setStep(Math.max(0, Math.min(TOTAL_SLIDES - 1, index)))
  const next = () => goTo(step + 1)
  const skipToEnd = () => goTo(TOTAL_SLIDES - 1)

  const trackStyle = {
    width: `${TOTAL_SLIDES * 100}%`,
    transform: `translateX(${-step * SLIDE_WIDTH_PCT}%)`,
    transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
  }

  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col overflow-hidden">
        <div className="relative flex-1 overflow-hidden">
          <div className="flex h-full" style={trackStyle}>
            {/* Slide 1 — Welcome */}
            <div className={slideWrapperClass} style={{ width: `${SLIDE_WIDTH_PCT}%` }}>
              <BearLogo />
              <p className="mt-6 text-base font-semibold uppercase tracking-widest" style={{ color: '#C9A227' }}>
                Be IMPOSSIBLE to Replace
              </p>
              <p className="mt-5 max-w-xs text-base leading-relaxed text-white">
                A lot of people will read, see and believe they need to make changes, however they need
                an accountability system.
              </p>
              <button
                type="button"
                onClick={next}
                className="mt-8 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
                style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
              >
                Let's Build Yours
              </button>
            </div>

            {/* Slide 2 — How it works */}
            <div className={slideWrapperClass} style={{ width: `${SLIDE_WIDTH_PCT}%` }}>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#C9A227' }}>
                Your Daily Practice
              </h1>

              <div className="mt-8 flex w-full max-w-xs flex-col gap-6">
                <PracticeRow
                  icon={<FlameIcon />}
                  text="One action every day. Small, specific, finishable in under 10 minutes."
                />
                <PracticeRow
                  icon={<PeopleIcon />}
                  text="Your Vault. The people who matter, never forgotten."
                />
                <PracticeRow
                  icon={<SparkleIcon />}
                  text="Your Wingman. AI that drafts the bones. You add the soul."
                />
              </div>

              <button
                type="button"
                onClick={next}
                className="mt-10 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
                style={{ backgroundColor: '#FFFFFF', color: '#1B2A4A' }}
              >
                Next
              </button>
              <button
                type="button"
                onClick={skipToEnd}
                className="mt-4 text-sm font-semibold"
                style={{ color: '#9CA8C2' }}
              >
                Skip
              </button>
            </div>

            {/* Slide 3 — The 50-Year Question */}
            <div className={slideWrapperClass} style={{ width: `${SLIDE_WIDTH_PCT}%` }}>
              <p className="max-w-xs text-3xl font-bold leading-tight text-white">
                What if every person in your life was there for the next 50 years?
              </p>
              <p className="mt-6 max-w-xs text-base font-semibold leading-relaxed" style={{ color: '#C9A227' }}>
                That's how we treat every relationship in The BEAR Den.
              </p>
              <button
                type="button"
                onClick={next}
                className="mt-10 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
                style={{ backgroundColor: '#FFFFFF', color: '#1B2A4A' }}
              >
                Next
              </button>
            </div>

            {/* Slide 4 — Add Your First Person */}
            <div className={slideWrapperClass} style={{ width: `${SLIDE_WIDTH_PCT}%` }}>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#C9A227' }}>
                Start with one person
              </h1>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-white">
                Think of someone you've been meaning to reach out to. Add them now and send them a
                message today.
              </p>
              <button
                type="button"
                onClick={onAddPerson}
                className="mt-8 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
                style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
              >
                Add Someone Now
              </button>
              <button type="button" onClick={next} className="mt-4 text-sm font-semibold text-white">
                I'll do this later
              </button>
            </div>

            {/* Slide 5 — You're Ready */}
            <div className={slideWrapperClass} style={{ width: `${SLIDE_WIDTH_PCT}%` }}>
              <SparkleIcon size={48} />
              <p className="mt-6 text-3xl font-bold" style={{ color: '#C9A227' }}>
                Your Den is ready.
              </p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-white">
                Your first BEAR action is waiting. Show up today and start building.
              </p>
              <button
                type="button"
                onClick={onComplete}
                className="mt-8 w-full max-w-xs rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
                style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
              >
                Enter the Den
              </button>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-2 pb-8 pt-2">
          {Array.from({ length: TOTAL_SLIDES }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goTo(index)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: index === step ? '24px' : '8px',
                backgroundColor: index === step ? '#C9A227' : '#2E3F63',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
