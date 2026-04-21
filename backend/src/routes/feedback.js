import { Router } from 'express'
import EvaluationService from '../services/EvaluationService.js'

const router = Router()

// POST /api/feedback/evaluate - Analyze transcript and get evaluation
router.post('/evaluate', async (req, res) => {
  const { transcript, topic } = req.body

  if (!transcript || transcript.length === 0) {
    return res.status(400).json({ error: 'Transcript is required' })
  }

  try {
    const evaluation = await EvaluationService.analyzeTranscript(transcript, topic)
    res.json(evaluation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST /api/feedback - Send feedback to tutor
router.post('/', (req, res) => {
  const { sessionId, ...feedbackData } = req.body

  // In production, this would send an email using Nodemailer/SendGrid
  // For now, we just log it

  console.log(`📧 Feedback requested for session ${sessionId}:`, feedbackData)

  res.json({
    success: true,
    message: 'Feedback report generation triggered',
    note: 'Email would be sent in production'
  })
})

export default router
