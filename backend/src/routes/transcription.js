import { Router } from 'express'
import multer from 'multer'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()

// Configure multer for audio file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg']
    if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'))
    }
  }
})

// POST /api/transcription/transcribe - Transcribe audio using Gemini 1.5 Flash
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  const startTime = Date.now()

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    console.log(`📁 Audio file received: ${req.file.size} bytes, type: ${req.file.mimetype}`)

    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ Gemini API key not configured')
      return res.status(500).json({ error: 'Gemini API key not configured.' })
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    console.log(`🎙️ Sending to Gemini for transcription... (${req.file.size} bytes)`)

    const result = await model.generateContent([
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype
        }
      },
      "Transcribe the audio exactly. If it's a math lesson, ensure technical terms are spelled correctly. Return ONLY the transcription text, nothing else."
    ])

    const text = result.response.text()
    const elapsed = Date.now() - startTime
    console.log(`🎙️ Gemini transcribed in ${elapsed}ms: "${text}"`)

    res.json({
      text: text,
      success: true,
      elapsed
    })

  } catch (error) {
    const elapsed = Date.now() - startTime
    console.error(`❌ Transcription error after ${elapsed}ms:`, error.message)
    res.status(500).json({ error: 'Transcription failed', details: error.message })
  }
})

export default router
