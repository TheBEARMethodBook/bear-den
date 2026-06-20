import { BEAR_VOICE_ENGINE } from '../src/lib/bearVoiceEngine.js'

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 512

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' })
  }

  const { messages, systemPrompt } = req.body ?? {}

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' })
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt || BEAR_VOICE_ENGINE,
        messages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const message = data?.error?.message || 'Anthropic API request failed'
      return res.status(response.status).json({ error: message })
    }

    const text = data?.content?.find((block) => block.type === 'text')?.text ?? ''

    return res.status(200).json({ text })
  } catch (error) {
    console.error('Wingman API error:', error)
    return res.status(500).json({ error: 'Failed to generate a response' })
  }
}
