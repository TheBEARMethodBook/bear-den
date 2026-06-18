import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import PhoneFrame from '../components/PhoneFrame'

const STAGE_COLOR = {
  strongest: '#C9A227',
  healthy: '#3F8F5C',
  fading: '#D9912E',
  needsWater: '#B3261E',
}

const STAGE_UP = {
  needsWater: 'fading',
  fading: 'healthy',
  healthy: 'strongest',
  strongest: 'strongest',
}

const INITIAL_PLANTS = [
  { name: 'Sarah Chen', stage: 'strongest' },
  { name: 'Marcus Webb', stage: 'fading' },
  { name: 'Priya Desai', stage: 'healthy' },
  { name: 'Liam Foster', stage: 'strongest' },
  { name: 'Nora Kim', stage: 'needsWater' },
  { name: 'Derek Hayes', stage: 'healthy' },
  { name: 'Ava Brooks', stage: 'fading' },
  { name: 'Connor Wells', stage: 'strongest' },
]

function FlameIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={color}>
      <path d="M12 2c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5 2 1 3.5 3.5 3.5 6A6.5 6.5 0 0 1 12 19a6.5 6.5 0 0 1-6.5-6.5c0-4 2.5-6 3.5-8.5.5 1.5 1 2 1.5 2C10.5 5 11 3.5 12 2Z" />
    </svg>
  )
}

function FlowerIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
      <circle cx="12" cy="8" r="2.4" fill={color} />
      <circle cx="8" cy="10" r="2.4" fill={color} />
      <circle cx="16" cy="10" r="2.4" fill={color} />
      <circle cx="9.5" cy="14" r="2.4" fill={color} />
      <circle cx="14.5" cy="14" r="2.4" fill={color} />
      <circle cx="12" cy="11.5" r="1.8" fill="#FAF6EE" />
      <path d="M12 16v5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TreeIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
      <path d="M12 3 6 11h3.2L5 18h14l-4.2-7H18z" fill={color} />
      <path d="M12 18v3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function PlantIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20V10" />
      <path d="M12 12c0-4-3-5-6-5 0 4 2 6 6 5Z" fill={color} stroke="none" />
      <path d="M12 9c0-3.5 2.5-4.5 5-4.5 0 3.5-1.5 5.5-5 4.5Z" fill={color} stroke="none" />
    </svg>
  )
}

function SeedlingIcon({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20v-7" />
      <path d="M12 13c0-3 -2-4 -4.5-4 0 3 1.5 4.5 4.5 4Z" fill={color} stroke="none" />
      <path d="M12 13c0-2.5 1.5-3.5 3.5-3.5 0 2.5 -1.2 3.7 -3.5 3.5Z" fill={color} stroke="none" />
    </svg>
  )
}

function PlantGraphic({ stage }) {
  const color = STAGE_COLOR[stage]
  if (stage === 'strongest') return <FlowerIcon color={color} />
  if (stage === 'healthy') return <TreeIcon color={color} />
  if (stage === 'fading') return <PlantIcon color={color} />
  return <SeedlingIcon color={color} />
}

export default function Garden({ onNavigate }) {
  const [plants, setPlants] = useState(INITIAL_PLANTS)

  const waterOne = () => {
    setPlants((prev) => {
      const targetIndex = prev.findIndex((p) => p.stage === 'needsWater' || p.stage === 'fading')
      if (targetIndex === -1) return prev
      return prev.map((plant, index) =>
        index === targetIndex ? { ...plant, stage: STAGE_UP[plant.stage] } : plant
      )
    })
  }

  return (
    <PhoneFrame>
      <header
        className="flex shrink-0 items-center justify-between px-4 py-3"
        style={{ backgroundColor: '#1B2A4A' }}
      >
        <span className="text-lg font-bold tracking-tight" style={{ color: '#C9A227' }}>
          Your Garden
        </span>
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1"
          style={{ backgroundColor: '#C9A227' }}
        >
          <FlameIcon color="#1B2A4A" />
          <span className="text-xs font-bold" style={{ color: '#1B2A4A' }}>
            12 days
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm">
            <span className="text-xl font-bold" style={{ color: '#1B2A4A' }}>
              17
            </span>
            <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
              Tended
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm">
            <span className="text-xl font-bold" style={{ color: '#D9912E' }}>
              4
            </span>
            <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
              Fading
            </span>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-white px-2 py-4 shadow-sm">
            <span className="text-xl font-bold" style={{ color: '#B3261E' }}>
              2
            </span>
            <span className="mt-1 text-center text-xs font-medium" style={{ color: '#2E2E2E' }}>
              Need Water
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {plants.map((plant) => (
            <div key={plant.name} className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"
              >
                <PlantGraphic stage={plant.stage} />
              </div>
              <span
                className="text-center text-xs font-medium leading-tight"
                style={{ color: '#1B2A4A' }}
              >
                {plant.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mt-6 rounded-2xl p-5 shadow-lg"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <p className="text-sm font-medium leading-snug text-white">
            One text changes a plant's color today.
          </p>
          <button
            type="button"
            onClick={waterOne}
            className="mt-4 w-full rounded-full py-3 text-sm font-bold uppercase tracking-wide shadow-md"
            style={{ backgroundColor: '#C9A227', color: '#1B2A4A' }}
          >
            Water it
          </button>
        </div>
      </main>

      <BottomNav activeTab="garden" onChange={onNavigate} />
    </PhoneFrame>
  )
}
