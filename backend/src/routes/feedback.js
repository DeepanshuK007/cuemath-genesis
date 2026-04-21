import { Router } from 'express'

const router = Router()

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
