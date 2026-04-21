import { Router } from 'express'

const router = Router()

// Mock flashcard generation from transcript
// In production, this would use Claude API to analyze transcript and generate cards

const generateCardsFromTranscript = (transcript) => {
  const cards = []

  // Simple mock logic - in production, AI would do this
  const text = transcript.toLowerCase()

  // Definition cards
  if (text.includes('fraction')) {
    cards.push({
      type: 'definition',
      front: 'What is a fraction?',
      back: 'A way to show parts of a whole number'
    })
  }

  if (text.includes('multiplication') || text.includes('multiply')) {
    cards.push({
      type: 'definition',
      front: 'What is multiplication?',
      back: 'Adding the same number multiple times'
    })
  }

  // Example cards
  if (text.includes('pizza') || text.includes('cake') || text.includes('apple')) {
    cards.push({
      type: 'example',
      front: 'Example of fractions with food:',
      back: 'Cutting a pizza into equal slices shows fractions in action!'
    })
  }

  // Tip cards
  if (text.includes('patient') || text.includes('slow')) {
    cards.push({
      type: 'tip',
      front: 'Teaching tip:',
      back: 'Always be patient and let students learn at their own pace'
    })
  }

  if (text.includes('real life') || text.includes('example')) {
    cards.push({
      type: 'tip',
      front: 'Key strategy:',
      back: 'Use real-life examples to make concepts relatable'
    })
  }

  return cards
}

// POST /api/flashcards/generate - Generate flashcards from transcript
router.post('/generate', (req, res) => {
  const { transcript } = req.body

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' })
  }

  const cards = generateCardsFromTranscript(transcript)

  console.log(`📚 Generated ${cards.length} flashcards from transcript`)

  res.json({
    success: true,
    cards,
    count: cards.length
  })
})

export default router
