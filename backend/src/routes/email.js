import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

// POST /api/email/send-report
router.post('/send-report', async (req, res) => {
  try {
    const { email, name, evaluation } = req.body

    if (!email || !evaluation) {
      return res.status(400).json({ error: 'Missing required fields: email or evaluation data.' })
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Email credentials not configured. Simulating email send.')
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      return res.json({ success: true, simulated: true, message: 'Email simulated (credentials not configured)' })
    }

    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // Construct the HTML email body
    const flashcardsHtml = evaluation.flashcards.map(card => `
      <div style="background-color: #f8f9fa; padding: 12px; margin-bottom: 8px; border-left: 4px solid #4CAF50;">
        <strong>${card.front}</strong><br/>
        <span style="color: #555;">${card.back}</span>
      </div>
    `).join('')

    const dimensionsHtml = evaluation.dimensions.map(dim => `
      <p><strong>${dim.name} (${dim.score}/5):</strong> ${dim.feedback}</p>
    `).join('')

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50;">Your Cuemath Evaluation Report</h1>
        <p>Hi ${name || 'Tutor'},</p>
        <p>Thank you for completing the Cuemath Genesis AI interview. Here is your feedback report:</p>
        
        <div style="background-color: #e3f2fd; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <h2 style="margin-top: 0; color: #1976d2;">Overall Verdict: ${evaluation.verdict}</h2>
          <p style="font-size: 1.2em; margin-bottom: 0;">Score: <strong>${evaluation.overallScore} / 5</strong></p>
        </div>

        <h3>Dimension Breakdown</h3>
        ${dimensionsHtml}

        ${evaluation.flashcards.length > 0 ? `
          <h3>Generated Flashcards</h3>
          <p>We extracted these concepts from your explanation:</p>
          ${flashcardsHtml}
        ` : ''}

        <hr style="border: 0; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #777; font-size: 0.9em;">Cuemath Genesis Team<br/>Scaling great math education.</p>
      </div>
    `

    // Send the email
    const info = await transporter.sendMail({
      from: `"Cuemath Genesis" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Cuemath Evaluation Report is Ready! 📊',
      html: htmlContent
    })

    console.log('✅ Email sent successfully:', info.messageId)
    res.json({ success: true, messageId: info.messageId })

  } catch (error) {
    console.error('❌ Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email. Please check your credentials.' })
  }
})

export default router
