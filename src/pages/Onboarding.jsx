import { useState } from 'react'
import { NavIcon } from '../components/BottomNav'

const SLIDES = [
  {
    icon: null,
    title: 'The BEAR Den',
    tagline: 'Be Impossible to Replace',
    description: 'Build the relationships and habits that make you irreplaceable, one small action at a time.',
  },
  {
    icon: 'today',
    title: 'Today',
    description: 'One small BEAR action a day. Mark it done and watch your streak grow.',
  },
  {
    icon: 'vault',
    title: 'Vault',
    description: 'Every action you take becomes a reflection. Your record of who you\'re becoming.',
  },
  {
    icon: 'garden',
    title: 'Garden',
    description: 'Relationships are like plants. The Garden shows you who needs a little water.',
  },
  {
    icon: 'wingman',
    title: 'Wingman',
    description: 'Stuck on what to say? Your Wingman is always in your corner.',
  },
]

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0)
  const isFirst = step === 0
  const isLast = step === SLIDES.length - 1
  const slide = SLIDES[step]

  const next = () => {
    if (isLast) {
      onComplete()
    } else {
      setStep((s) => s + 1)
    }
  }

  const back = () => setStep((s) => Math.max(0, s - 1))

  return (
    <div className="flex min-h-screen w-full justify-center" style={{ backgroundColor: '#1B2A4A' }}>
      <div className="relative flex h-screen w-full max-w-[430px] flex-col px-6 py-8">
        <div className="flex shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={back}
            className="text-sm font-semibold"
            style={{ color: isFirst ? 'transparent' : '#9CA8C2' }}
            disabled={isFirst}
          >
            Back
          </button>
          <button
            type="button"
            onClick={onComplete}
            className="text-sm font-semibold"
            style={{ color: '#9CA8C2' }}
          >
            Skip
          </button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {slide.icon ? (
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: '#2E3F63' }}
            >
              <NavIcon name={slide.icon} color="#C9A227" />
            </div>
          ) : (
            <div
              className="rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
            >
              Welcome
            </div>
          )}

          <h1 className="mt-6 text-3xl font-bold tracking-tight" style={{ color: '#C9A227' }}>
            {slide.title}
          </h1>

          {slide.tagline && (
            <p className="mt-2 text-base font-medium text-white">{slide.tagline}</p>
          )}

          <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: '#D7DEEB' }}>
            {slide.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {SLIDES.map((_, index) => (
              <span
                key={index}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: index === step ? '24px' : '8px',
                  backgroundColor: index === step ? '#C9A227' : '#2E3F63',
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            className="w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            {isLast ? 'Enter the Den' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
