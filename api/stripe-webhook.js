import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: { bodyParser: false },
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secretKey || !webhookSecret || !supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing required environment variables for stripe-webhook')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    const stripe = new Stripe(secretKey)
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.userId

    if (userId) {
      const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'pro', pro_started_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) {
        console.error('Supabase subscription update error:', error)
        return res.status(500).json({ error: 'Failed to update subscription' })
      }
    } else {
      console.warn('checkout.session.completed received without userId in metadata')
    }
  }

  return res.status(200).json({ received: true })
}
