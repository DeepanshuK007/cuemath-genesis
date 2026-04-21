import { Router } from 'express'
import { google } from 'googleapis'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// Google OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI || 'http://localhost:5173'
)

// In-memory user store (use a real database in production)
const users = new Map()

// POST /api/auth/google - Verify Google token and sign in
router.post('/google', async (req, res) => {
  const { token } = req.body

  if (!token) {
    return res.status(400).json({ error: 'Token is required' })
  }

  try {
    // Verify the token with Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || '692828442395-4embqppllbjrhgtuhuktmrjmdau32f3q.apps.googleusercontent.com'
    })

    const payload = ticket.getPayload()

    // Check if user already exists, if not create new
    let user = Array.from(users.values()).find(u => u.email === payload.email)

    if (!user) {
      user = {
        id: uuidv4(),
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        createdAt: new Date().toISOString(),
        isSignedIn: true
      }
      users.set(user.id, user)
      console.log(`📝 New user registered via Google: ${user.name} (${user.email})`)
    } else {
      // Update sign-in info
      user.isSignedIn = true
      user.lastSignIn = new Date().toISOString()
      users.set(user.id, user)
    }

    console.log(`✅ User signed in: ${user.name} (${user.email})`)

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    })

  } catch (error) {
    console.error('Google token verification failed:', error.message)
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

// POST /api/auth/email - Email/password sign in (mock)
router.post('/email', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  // Mock authentication - accept any email/password
  // In production, verify against hashed passwords in database
  const user = {
    id: uuidv4(),
    email,
    name: email.split('@')[0],
    createdAt: new Date().toISOString(),
    isSignedIn: true
  }

  users.set(user.id, user)
  console.log(`✅ User signed in via email: ${user.email}`)

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  })
})

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const userId = authHeader.replace('Bearer ', '').trim()

  // For demo, we'll accept any ID format and return mock user
  // In production, verify JWT or session token
  res.json({
    user: {
      id: userId,
      name: 'Demo User',
      email: 'demo@example.com'
    }
  })
})

export default router
