import { useState } from 'react'
import PhoneFrame from '../components/PhoneFrame'

const SECTIONS = [
  { key: 'today', icon: '📅', title: 'Today', description: 'Your daily anchor. One action. One streak.' },
  { key: 'vault', icon: '🏛️', title: 'Your Vault', description: 'Your relationship memory. Everyone who matters.' },
  { key: 'garden', icon: '🌱', title: 'The Garden', description: 'See who needs attention before it is too late.' },
  { key: 'wingman', icon: '✍️', title: 'Wingman', description: 'AI-drafted messages. You add the soul.' },
  { key: 'thework', icon: '💪', title: 'The Work', description: 'Chapter exercises from the book. Do them.' },
  { key: 'profile', icon: '⚙️', title: 'Your Profile', description: 'Streaks, reflections, settings, and more.' },
]

const CONTENT = {
  today: [
    { type: 'heading', text: 'Your daily anchor' },
    { type: 'body', text: 'Every day The BEAR Den gives you one relationship action from The BEAR Method. It takes less than five minutes. It builds the habit that makes you IMPOSSIBLE to replace.' },
    { type: 'heading', text: 'The streak' },
    { type: 'body', text: 'Tap Done for Today to keep your streak alive. The streak is not just a number. It is proof that you showed up when it was easier not to.' },
    { type: 'heading', text: "Who's on your mind today?" },
    { type: 'body', text: 'Below the daily action you will see the people in your Vault who have gone the longest without contact. Tap Write a note to let Wingman draft something for them instantly.' },
    { type: 'heading', text: 'Coming up' },
    { type: 'body', text: 'If anyone in your Vault has a birthday or important date in the next 7 days, it surfaces here. Keep those dates updated and the app does the remembering for you.' },
  ],
  vault: [
    { type: 'heading', text: 'Your relationship memory' },
    { type: 'body', text: 'The Vault is where you store the people who matter. Not everyone you have ever met. The people you want to show up for over the long term.' },
    { type: 'heading', text: 'Adding people' },
    { type: 'body', text: 'Tap the + button and use Brain Dump mode to describe someone in your own words. Wingman parses it into a structured profile automatically. Or use Quick Add if you just want the basics.' },
    { type: 'heading', text: 'BEAR stages' },
    { type: 'body', text: 'Each person in your Vault has a BEAR stage: Build, Engage, Authentic, or Restore. These map directly to the chapters in the book. They tell you where the relationship is and where it needs to go.' },
    { type: 'heading', text: 'Details that matter' },
    { type: 'body', text: "The more you add to a person's profile, the more powerful Wingman becomes. A kid's name, a project they mentioned, a city they moved to. Specificity is the whole game." },
  ],
  garden: [
    { type: 'heading', text: 'Your relationship health at a glance' },
    { type: 'body', text: 'The Garden shows every person in your Vault color-coded by how recently you connected: Thriving is green (within 14 days), Needs Water is amber (15 to 30 days), Wilting is red (30+ days).' },
    { type: 'heading', text: 'Why it matters' },
    { type: 'body', text: 'Most relationships do not end in a fight. They end in drift. The Garden makes drift visible before it becomes permanent.' },
    { type: 'heading', text: 'Water it' },
    { type: 'body', text: 'Pro users can tap Water It to immediately open a Wingman script for the most overdue person in their Vault. One tap from noticing to acting.' },
  ],
  wingman: [
    { type: 'heading', text: 'AI that drafts. You that connects.' },
    { type: 'body', text: 'Wingman writes the first draft of messages you have been putting off. A check-in for someone you have not contacted in months. A note after meeting someone new. A repair message for a relationship that needs it.' },
    { type: 'heading', text: 'Six scripts' },
    { type: 'body', text: 'Choose from six script types: No-agenda check-in, Follow up after meeting someone, Congratulations note, Repair and restoration text, Hard-season check-in, and Close the loop thank you.' },
    { type: 'heading', text: 'The most important line' },
    { type: 'body', text: 'Every Wingman script ends with: Before you send this, add the one detail only you know. That line is not a suggestion. It is the whole point. Wingman drafts the bones. You add the soul.' },
    { type: 'heading', text: 'Write a note' },
    { type: 'body', text: 'On the Today screen, tap Write a note on any nudge card to skip the menu entirely. Wingman will generate a no-agenda check-in for that person immediately.' },
  ],
  thework: [
    { type: 'heading', text: 'The exercises from the book' },
    { type: 'body', text: 'Every chapter of The BEAR Method ends with a practice exercise. The Work brings all 12 of them into the app so you can do them at your own pace, track your progress, and come back to them anytime.' },
    { type: 'heading', text: 'How to use it' },
    { type: 'body', text: 'Tap a chapter to open its exercises. Checkboxes mark actions you have taken. Text fields let you write your answers and save them. Your responses are stored privately and never shared.' },
    { type: 'heading', text: 'Already did the exercises?' },
    { type: 'body', text: 'If you worked through the book and already did the exercises, use The Work as a review. Revisit your answers. See how your thinking has changed. The questions hit differently once you have lived with the framework for a while.' },
  ],
  profile: [
    { type: 'heading', text: 'Your stats' },
    { type: 'body', text: 'Your profile shows your current streak, your total reflections saved, and the number of relationships in your Vault. These three numbers tell the story of how seriously you are taking this.' },
    { type: 'heading', text: 'Reflections' },
    { type: 'body', text: 'Every time you tap Done for Today, you get the option to write a short reflection. Who did you reach out to? What happened? These stack up over time into a record of real relational growth.' },
    { type: 'heading', text: 'Edit Profile' },
    { type: 'body', text: 'Update your display name and account details here.' },
    { type: 'heading', text: 'The Work and this guide' },
    { type: 'body', text: 'Both The Work exercises and this guide live on your Profile screen so they are always one tap away without cluttering the main navigation.' },
  ],
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
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

export default function HowToUse({ onNavigate }) {
  const [selectedSection, setSelectedSection] = useState(null)

  if (selectedSection) {
    const section = SECTIONS.find((s) => s.key === selectedSection)
    const blocks = CONTENT[selectedSection] || []

    return (
      <PhoneFrame>
        <header
          className="flex shrink-0 items-center gap-3 px-4 py-3"
          style={{ backgroundColor: '#1B2A4A' }}
        >
          <button type="button" onClick={() => setSelectedSection(null)} aria-label="Back">
            <BackIcon />
          </button>
          <span
            className="flex-1 pr-7 text-center text-base font-bold tracking-tight"
            style={{ color: '#C9A227' }}
          >
            {section?.title}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto px-5 py-4 pb-8" style={{ backgroundColor: '#FAF6EE' }}>
          {blocks.map((block, index) =>
            block.type === 'heading' ? (
              <p
                key={index}
                className="mt-4 mb-1 text-base font-bold"
                style={{ color: '#1B2A4A' }}
              >
                {block.text}
              </p>
            ) : (
              <p
                key={index}
                className="mb-3 text-sm leading-relaxed"
                style={{ color: '#9CA8C2' }}
              >
                {block.text}
              </p>
            )
          )}
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
          className="flex-1 pr-7 text-center text-base font-bold tracking-tight"
          style={{ color: '#C9A227' }}
        >
          How to Use The BEAR Den
        </span>
      </header>

      <p className="mt-2 px-6 text-center text-sm" style={{ color: '#9CA8C2' }}>
        Five screens. One mission. Be IMPOSSIBLE to replace.
      </p>

      <main className="flex-1 overflow-y-auto pb-6 pt-2">
        {SECTIONS.map((section) => (
          <button
            key={section.key}
            type="button"
            onClick={() => setSelectedSection(section.key)}
            className="mx-4 mb-3 flex w-[calc(100%-2rem)] items-center gap-3 rounded-xl p-4 text-left shadow-sm"
            style={{ backgroundColor: '#FAF6EE' }}
          >
            <span className="text-2xl leading-none">{section.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold" style={{ color: '#1B2A4A' }}>
                {section.title}
              </p>
              <p className="mt-0.5 text-sm" style={{ color: '#9CA8C2' }}>
                {section.description}
              </p>
            </div>
            <ArrowIcon />
          </button>
        ))}
      </main>
    </PhoneFrame>
  )
}
