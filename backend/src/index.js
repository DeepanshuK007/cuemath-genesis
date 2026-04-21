import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import authRouter from './routes/auth.js'
import tutorsRouter from './routes/tutors.js'
import interviewRouter from './routes/interview.js'
import feedbackRouter from './routes/feedback.js'
import flashcardsRouter from './routes/flashcards.js'
import testimonialsRouter from './routes/testimonials.js'
import paymentRouter from './routes/payment.js'
import transcriptionRouter from './routes/transcription.js'
import emailRouter from './routes/email.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/tutors', tutorsRouter)
app.use('/api/interview', interviewRouter)
app.use('/api/feedback', feedbackRouter)
app.use('/api/flashcards', flashcardsRouter)
app.use('/api/testimonials', testimonialsRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/transcription', transcriptionRouter)
app.use('/api/email', emailRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../../frontend/dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../../frontend/dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
