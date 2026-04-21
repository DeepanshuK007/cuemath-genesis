import express from 'express'
import Stripe from 'stripe'

const router = express.Router()

// Initialize Stripe if a key is provided, otherwise we'll mock it
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

router.post('/create-checkout-session', async (req, res) => {
  try {
    const origin = req.headers.origin || 'http://localhost:5173'

    if (!stripe) {
      // Mock mode: No stripe key provided, simulate successful checkout redirect
      console.log('No STRIPE_SECRET_KEY found. Returning mock checkout URL.')
      // Simulate a small delay for realism
      await new Promise(resolve => setTimeout(resolve, 800))
      return res.json({ url: `${origin}/checkout-success` })
    }

    // Real Stripe mode
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Learning Library Access',
              description: 'Unlimited access to all tutorials, flashcards, and feedback reports.',
            },
            unit_amount: 1999, // $19.99
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/testimonials`,
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
