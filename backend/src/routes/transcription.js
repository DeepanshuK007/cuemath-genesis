import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import OpenAI, { toFile } from 'openai'

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

// POST /api/transcription/transcribe - Transcribe audio using Whisper
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  const startTime = Date.now()

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' })
    }

    console.log(`📁 Audio file received: ${req.file.size} bytes, type: ${req.file.mimetype}`)

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-api-key-here') {
      console.log('❌ OpenAI API key not configured')
      return res.status(500).json({ error: 'OpenAI API key not configured. Please add your key to the .env file.' })
    }

    // Create OpenAI client lazily (after dotenv loads)
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    // Create a buffer from the audio data
    const buffer = Buffer.from(req.file.buffer)
    console.log(`🎙️ Sending to Whisper... (${buffer.length} bytes)`)

    const file = await toFile(buffer, `audio.${req.file.mimetype.split('/')[1] || 'webm'}`, { type: req.file.mimetype });

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en'
    })

    const elapsed = Date.now() - startTime
    console.log(`🎙️ Whisper transcribed in ${elapsed}ms: "${transcription.text}"`)

    res.json({
      text: transcription.text,
      success: true,
      elapsed
    })

  } catch (error) {
    const elapsed = Date.now() - startTime
    console.error(`❌ Whisper error after ${elapsed}ms:`, error.message)
    res.status(500).json({ error: 'Transcription failed', details: error.message })
  }
})

export default router
