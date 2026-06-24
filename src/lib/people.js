import { supabase } from './supabase'

export const RELATIONSHIP_TYPES = ['Client', 'Colleague', 'Friend', 'Family', 'Mentor', 'Prospect', 'Community']

export const BEAR_STAGES = ['Building', 'Engaging', 'Strong', 'Restore']

export const STAGE_DOT = {
  Building: '#D9912E',
  Engaging: '#3F8F5C',
  Strong: '#3F8F5C',
  Restore: '#B3261E',
}

function formatRelativeTime(value) {
  if (!value) return null
  const diffMs = Date.now() - new Date(value).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  const years = Math.floor(days / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function mapPersonRow(row) {
  const stage = BEAR_STAGES.includes(row.bear_stage) ? row.bear_stage : 'Building'
  const lastContactedLabel = formatRelativeTime(row.last_contacted)

  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship_type || 'Contact',
    stage,
    dot: STAGE_DOT[stage],
    phone: row.phone || '',
    email: row.email || '',
    howWeMet: row.how_we_met || '',
    details: row.details || '',
    importantDates: row.important_dates || '',
    lastContacted: lastContactedLabel || `Added ${formatRelativeTime(row.created_at) || 'recently'}`,
    history: [],
  }
}

export async function fetchPeople(userId) {
  const { data, error } = await supabase
    .from('people')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data || []).map(mapPersonRow)
}

export async function insertPerson(userId, person) {
  const { data, error } = await supabase
    .from('people')
    .insert({
      user_id: userId,
      name: person.name.trim(),
      relationship_type: person.relationshipType || null,
      bear_stage: BEAR_STAGES.includes(person.bearStage) ? person.bearStage : 'Building',
      phone: person.phone?.trim() || null,
      email: person.email?.trim() || null,
      how_we_met: person.howWeMet?.trim() || null,
      details: person.details?.trim() || null,
      important_dates: person.importantDates?.trim() || null,
    })
    .select()
    .single()

  if (error) throw error

  return mapPersonRow(data)
}

export async function updatePerson(personId, person) {
  const { data, error } = await supabase
    .from('people')
    .update({
      name: person.name.trim(),
      relationship_type: person.relationshipType || null,
      bear_stage: BEAR_STAGES.includes(person.bearStage) ? person.bearStage : 'Building',
      phone: person.phone?.trim() || null,
      email: person.email?.trim() || null,
      how_we_met: person.howWeMet?.trim() || null,
      details: person.details?.trim() || null,
      important_dates: person.importantDates?.trim() || null,
    })
    .eq('id', personId)
    .select()
    .single()

  if (error) throw error

  return mapPersonRow(data)
}

export async function updateLastContacted(personId) {
  const { error } = await supabase
    .from('people')
    .update({ last_contacted: new Date().toISOString() })
    .eq('id', personId)

  if (error) throw error
}
