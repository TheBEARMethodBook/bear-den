import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({ error: 'Server is missing STRIPE_SECRET_KEY' })
  }

  const { priceId, userId } = req.body ?? {}

  if (!priceId || !userId) {
    return res.status(400).json({ error: 'priceId and userId are required' })
  }

  try {
    const stripe = new Stripe(secretKey)

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://www.getbearden.com/success',
      cancel_url: 'https://www.getbearden.com',
      metadata: { userId },
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
