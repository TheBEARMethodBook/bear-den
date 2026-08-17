import { supabase } from './supabase'

export const BEAR_ACTIONS = [
  // Week 1: BUILD: identifying and reaching out to key relationships
  {
    id: 1,
    week: 1,
    theme: 'BUILD',
    action:
      "Make a list of 5 people you haven't talked to in over 3 months who you'd genuinely miss if they disappeared from your life. Pick one and send them a text today, no reason needed, just \"thinking of you.\"",
    why_it_works:
      "Most people invest in relationships that feel urgent, not the ones that matter most over a lifetime. The people you'd genuinely miss in 50 years are usually the easiest ones to keep postponing. Naming them on purpose is the first step to actually keeping them.",
    chapter: 'Chapter 1: The 50-Year Mindset',
  },
  {
    id: 2,
    week: 1,
    theme: 'BUILD',
    action:
      "Call one person from yesterday's list. Don't text. Call. If they don't answer, leave a voicemail that says nothing more than you were thinking of them.",
    why_it_works:
      "A call with literally nothing to ask for is rare enough now to register as care rather than a transaction. The absence of an agenda is the entire message, and it's what proves the outreach was about them, not you.",
    chapter: 'Chapter 2: The No-Agenda Outreach',
  },
  {
    id: 3,
    week: 1,
    theme: 'BUILD',
    action:
      "Reach out to someone in your network who could help your career, but instead of asking for something, ask how their project, family, or health is going, and actually wait for the real answer.",
    why_it_works:
      "People can feel the difference between contact that's about them and contact that's about you. Removing the ask, even just once, is what separates relationship-building from networking with a hidden agenda.",
    chapter: 'Chapter 2: The No-Agenda Outreach',
  },
  {
    id: 4,
    week: 1,
    theme: 'BUILD',
    action:
      'Instead of texting "Hope you\'re well!", name one specific thing about the person: a project they mentioned, a kid\'s age, a move they made. Send that instead.',
    why_it_works:
      "Generic warmth reads as a mail-merge, no matter how sincere it is. A single specific detail proves you were actually paying attention, which is the entire currency of the gesture.",
    chapter: 'Chapter 3: Specificity Over Generic',
  },
  {
    id: 5,
    week: 1,
    theme: 'BUILD',
    action:
      'Pick the relationship that feels the most "someday I should reach out" and do it today, with a specific memory attached: "I was just thinking about [specific memory] and wanted to say hi."',
    why_it_works:
      '"Someday" relationships decay fastest because nothing ever forces the day to arrive. Naming a real memory turns a vague intention into a concrete, five-minute action you can finish before you talk yourself out of it.',
    chapter: 'Chapter 3: Specificity Over Generic',
  },
  {
    id: 6,
    week: 1,
    theme: 'BUILD',
    action:
      "Write down the 3 relationships you'd protect first if you could only keep ten people in your life. Tell one of them, in almost those words, why they matter to you.",
    why_it_works:
      "Most people never say the quiet part, that someone matters this much, until a crisis forces it out of them. Saying it now, with no occasion attached, makes the relationship sturdier before it's ever tested.",
    chapter: 'Chapter 1: The 50-Year Mindset',
  },
  {
    id: 7,
    week: 1,
    theme: 'BUILD',
    action:
      "Send one message today that does only one thing: thank someone for something they did for you months or years ago that you never properly acknowledged.",
    why_it_works:
      "Gratitude with a delay proves you didn't just feel it in the moment, you kept it. That's rarer and more durable than gratitude expressed right when it happened, and it costs the other person nothing to receive.",
    chapter: 'Chapter 2: The No-Agenda Outreach',
  },

  // Week 2: ENGAGE: going deeper in conversations
  {
    id: 8,
    week: 2,
    theme: 'ENGAGE',
    action:
      'In your next conversation today, after someone gives you the surface-level answer to "how are you," ask one more question that goes underneath it: "No, really, how are you?"',
    why_it_works:
      "Most conversations stay at the surface because nobody asks the second question. One extra question, asked with real curiosity instead of politeness, is usually all it takes to get somewhere true.",
    chapter: 'Chapter 4: The One Deeper Question',
  },
  {
    id: 9,
    week: 2,
    theme: 'ENGAGE',
    action:
      "Call someone and let there be silence after they answer a question. Don't fill it. See what they say next when you don't rescue the pause.",
    why_it_works:
      "People often say the most honest thing right after the moment they expect you to change the subject. Resisting the urge to fix or fill the silence gives them the room to actually keep going.",
    chapter: 'Chapter 5: Presence Over Prescription',
  },
  {
    id: 10,
    week: 2,
    theme: 'ENGAGE',
    action:
      "Ask someone what they're actually worried about right now, not to solve it, just to know it. Resist offering advice unless they ask for it directly.",
    why_it_works:
      "The instinct to problem-solve often shuts a conversation down before it really opens. Being asked to simply witness something, with no fix attached, is rarer and more valuable to most people than being handed a solution.",
    chapter: 'Chapter 5: Presence Over Prescription',
  },
  {
    id: 11,
    week: 2,
    theme: 'ENGAGE',
    action:
      "Notice something someone is doing well: at work, as a parent, in how they're handling something hard. Tell them specifically what you noticed, today.",
    why_it_works:
      "Most people only hear feedback when something's wrong. Specific, unprompted praise registers as proof that someone is paying attention to their actual life, not just their performance.",
    chapter: 'Chapter 6: Celebrating Others',
  },
  {
    id: 12,
    week: 2,
    theme: 'ENGAGE',
    action:
      "Ask a friend or family member about a goal or hope they mentioned a while back. Follow up on it by name, even if it's been months.",
    why_it_works:
      "Following up on something small from months ago signals it was actually stored, not just politely nodded at in the moment. That's what makes someone feel remembered rather than merely acknowledged.",
    chapter: 'Chapter 4: The One Deeper Question',
  },
  {
    id: 13,
    week: 2,
    theme: 'ENGAGE',
    action:
      'In a conversation today, ask someone what they\'re proud of lately, and don\'t let them deflect with "oh, nothing really." Wait for the real answer.',
    why_it_works:
      "Most people are trained to downplay their own wins on reflex. Asking again, gently, gives them permission to actually claim something they're proud of out loud, often for the first time.",
    chapter: 'Chapter 6: Celebrating Others',
  },
  {
    id: 14,
    week: 2,
    theme: 'ENGAGE',
    action:
      "Tell someone exactly what you appreciate about how they show up in your life. Be specific about the behavior, not just the relationship.",
    why_it_works:
      '"I appreciate you" is easy to say and easy to forget. Naming the specific behavior, the showing up, the listening, the consistency, is what makes it land and stick instead of dissolving into a pleasantry.',
    chapter: 'Chapter 6: Celebrating Others',
  },
  {
    id: 15,
    week: 2,
    theme: 'ENGAGE',
    action:
      "Ask someone a question you've genuinely never asked them before, even if you've known them for years, about their childhood, a fear, a turning point.",
    why_it_works:
      "Long history with someone can quietly become a substitute for actually knowing them. A genuinely new question, even late into a relationship, reopens a curiosity that routine has worn down.",
    chapter: 'Chapter 4: The One Deeper Question',
  },

  // Week 3: AUTHENTIC: honest communication and dropping performance
  {
    id: 16,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      "In one conversation today, drop the version of yourself that's performing fine and say one true thing about how you're actually doing.",
    why_it_works:
      "Most relationships run on a polished update instead of the truth. Offering one honest sentence about your real state is usually what gives the other person permission to do the same.",
    chapter: 'Chapter 7: Dropping the Performance',
  },
  {
    id: 17,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      "Tell someone something you got wrong recently: a mistake, a misjudgment, a moment you handled badly. Don't minimize it or turn it into a joke.",
    why_it_works:
      "Admitting fault without a punchline to soften it is uncomfortable precisely because it's honest. That discomfort is what makes a relationship feel real instead of curated.",
    chapter: 'Chapter 7: Dropping the Performance',
  },
  {
    id: 18,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      'Ask someone, "Is there anything I can do that would actually be useful to you right now?" Mean it literally, not rhetorically.',
    why_it_works:
      "Most offers to help are vague enough to never require action. A literal, specific offer forces you past good intentions into something the other person can actually use.",
    chapter: 'Chapter 8: The How-Can-I Mindset',
  },
  {
    id: 19,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      "Say the thing you've been avoiding saying to someone: a boundary, an apology, a piece of feedback. Say it in person or by call, not text.",
    why_it_works:
      "Avoided conversations don't disappear, they just calcify into distance. Saying the hard thing directly, even imperfectly, is what authenticity actually costs.",
    chapter: 'Chapter 7: Dropping the Performance',
  },
  {
    id: 20,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      'Find one loop you left open with someone: a promise, a "let\'s circle back," a question you never answered. Close it today.',
    why_it_works:
      "An open loop quietly tells someone they weren't a priority, even when that was never the intent. Closing it, even late, restores trust that the silence was wearing down.",
    chapter: 'Chapter 9: Closing the Loop',
  },
  {
    id: 21,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      "Offer help to someone without waiting to be asked, and make the offer specific enough that all they have to do is say yes: name the day, the task, the time.",
    why_it_works:
      '"Let me know if you need anything" puts the burden of asking on someone who is already struggling. A pre-built, specific offer removes that burden entirely.',
    chapter: 'Chapter 8: The How-Can-I Mindset',
  },
  {
    id: 22,
    week: 3,
    theme: 'AUTHENTIC',
    action:
      "Tell someone the truth about something you've been politely agreeing with but don't actually believe, kindly and plainly.",
    why_it_works:
      "Agreeable silence feels safe in the moment, but it's a low-grade dishonesty that compounds over time. Saying what you actually think, with care, is what real respect sounds like.",
    chapter: 'Chapter 7: Dropping the Performance',
  },

  // Week 4: RESTORE: reopening faded relationships
  {
    id: 23,
    week: 4,
    theme: 'RESTORE',
    action:
      'Think of one relationship that faded without a fight, no falling out, just drift. Send the first message: no apology required, just "it\'s been too long, how are you?"',
    why_it_works:
      "Most faded relationships stay faded because both sides are waiting for the other to make the silence not-awkward first. A plain, low-stakes opener removes the need for either side to explain the gap.",
    chapter: 'Chapter 10: The Door-Opener',
  },
  {
    id: 24,
    week: 4,
    theme: 'RESTORE',
    action:
      "Reach out to someone you lost touch with after a move, job change, or breakup that wasn't anyone's fault. Don't explain the gap, just open the door.",
    why_it_works:
      "Over-explaining why you went quiet puts the relationship on trial before it's even reopened. Skipping the explanation lets it pick back up on its own terms instead of your defense of the silence.",
    chapter: 'Chapter 10: The Door-Opener',
  },
  {
    id: 25,
    week: 4,
    theme: 'RESTORE',
    action:
      'If there\'s tension behind a relationship\'s fade, a slight, a misunderstanding, name it plainly in one message: "I know things got weird, and I\'d like that to not be the case anymore."',
    why_it_works:
      "Naming the unspoken tension directly is uncomfortable for exactly five seconds, and then it's just... said. That five seconds of discomfort is usually the entire cost of restoring the relationship.",
    chapter: 'Chapter 9: Closing the Loop',
  },
  {
    id: 26,
    week: 4,
    theme: 'RESTORE',
    action:
      'Reconnect with someone by referencing something good from your shared history, not the reason you drifted: "I still think about [specific memory] and you\'ve been on my mind."',
    why_it_works:
      "Leading with a genuine shared memory instead of an excuse for the silence reminds both people what the relationship was actually built on. It's easier to walk back toward warmth than toward an apology.",
    chapter: 'Chapter 10: The Door-Opener',
  },
  {
    id: 27,
    week: 4,
    theme: 'RESTORE',
    action:
      "Pick someone you assume has moved on without you and test that assumption. Reach out anyway. The worst case is a relationship that stays exactly as faded as it already is.",
    why_it_works:
      "The fear of rejection keeps most restoration attempts from ever happening, but the downside of trying is almost always smaller than imagined. Most faded relationships are one message away from reopening.",
    chapter: 'Chapter 10: The Door-Opener',
  },
  {
    id: 28,
    week: 4,
    theme: 'RESTORE',
    action:
      'Send a restoration message with one low-stakes, specific ask attached, like coffee on a particular day or a 10-minute call, instead of a vague "we should catch up sometime."',
    why_it_works:
      '"We should catch up sometime" is a sentence designed to never become a plan. A specific, low-effort invitation is what actually turns a reopened door into a real reconnection.',
    chapter: 'Chapter 3: Specificity Over Generic',
  },
  {
    id: 29,
    week: 4,
    theme: 'RESTORE',
    action:
      "If a relationship faded because of something you did, take responsibility for it directly, no defense, no \"but you also,\" and let that be the whole message.",
    why_it_works:
      "An apology that explains itself isn't really an apology, it's a negotiation. A clean, undefended apology is what actually gives someone room to forgive.",
    chapter: 'Chapter 7: Dropping the Performance',
  },
  {
    id: 30,
    week: 4,
    theme: 'RESTORE',
    action:
      "Reach out to the person on your list who feels hardest to restore, and treat it like day one of a new relationship: curious, patient, with no expectation of picking up exactly where you left off.",
    why_it_works:
      "The relationships worth the most effort to restore are often the ones that feel the most stalled. Treating the reconnection as a fresh start, not a resumption, takes the pressure off both people to perform a history they no longer share.",
    chapter: 'Chapter 1: The 50-Year Mindset',
  },
]

export function getActionForDay(dayNumber) {
  const total = BEAR_ACTIONS.length
  const index = ((dayNumber - 1) % total + total) % total
  return BEAR_ACTIONS[index]
}

export function toDateKey(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function computeTotalDays(dateKeys) {
  return dateKeys.size
}

async function fetchCompletionDateKeys(userId) {
  const { data, error } = await supabase
    .from('daily_actions')
    .select('completed_at')
    .eq('user_id', userId)

  if (error) throw error

  return new Set((data || []).map((row) => toDateKey(row.completed_at)))
}

export async function getStreakStatus(userId) {
  const dateKeys = await fetchCompletionDateKeys(userId)
  const todayKey = toDateKey(new Date())
  const completedToday = dateKeys.has(todayKey)
  const totalDays = computeTotalDays(dateKeys)

  return { streak: totalDays, completedToday, isFirstEver: dateKeys.size === 0 }
}

export async function recordDailyAction(userId, actionText) {
  const dateKeys = await fetchCompletionDateKeys(userId)
  const todayKey = toDateKey(new Date())
  const isFirstEver = dateKeys.size === 0

  if (dateKeys.has(todayKey)) {
    const streak = computeTotalDays(dateKeys)
    return { streak, isFirstEver: false }
  }

  dateKeys.add(todayKey)
  const streak = computeTotalDays(dateKeys)

  const { error } = await supabase.from('daily_actions').insert({
    user_id: userId,
    action_text: actionText,
    streak_count: streak,
  })

  if (error) throw error

  return { streak, isFirstEver }
}
