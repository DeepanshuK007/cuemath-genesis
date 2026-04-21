import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import OpenAI from 'openai'

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// In-memory storage
const sessions = new Map()
const evaluations = new Map()

// Topics bank
const topics = [
  { id: 1, title: "Explain fractions to a 9-year-old" },
  { id: 2, title: "How would you teach a student that 0.5 = 1/2?" },
  { id: 3, title: "A student says 'I hate math.' What do you do?" },
  { id: 4, title: "Explain why 2 + 2 = 4 to someone who's never heard of numbers" },
  { id: 5, title: "How would you help a student who's been staring at a problem for 5 minutes?" },
  { id: 6, title: "Explain multiplication to someone who only knows addition" },
  { id: 7, title: "A student got the same question wrong 3 times. How do you help?" },
  { id: 8, title: "Explain the concept of 'negative numbers' to a 5th grader" },
  { id: 9, title: "How would you make fractions less scary for a struggling student?" },
  { id: 10, title: "A student asks 'When will I ever use this in real life?' — your response?" },
]

// Mock AI responses for the "Curious Child"
const mockAIResponses = {
  intro: "Hi! I'm Alex, and I'm 10 years old. Can you tell me what you do? I'm curious!",
  topic: (topic) => `Okay, so my teacher gave me this card but I don't get it... ${topic}. Can you help me understand?`,
  stress: "I don't get it... this is too hard. Why is this so confusing?",
  jargon: "Wait, what does that word mean? I don't understand big words...",
  wrapup: "Oh! I think I get it now. That was really helpful! Thank you so much for being patient with me.",
  end: "Okay, I think that's all I wanted to ask. You were really nice! Bye bye!"
}

// POST /api/interview/start - Start new interview session
router.post('/start', (req, res) => {
  const { tutorId, topicId } = req.body

  const sessionId = uuidv4()
  const session = {
    id: sessionId,
    tutorId,
    topicId,
    topic: topics.find(t => t.id === topicId) || topics[Math.floor(Math.random() * topics.length)],
    startedAt: new Date().toISOString(),
    messages: [],
    status: 'active'
  }

  sessions.set(sessionId, session)
  console.log(`🎤 Interview started: ${sessionId}`)

  res.json({ sessionId, topic: session.topic })
})

// POST /api/interview/message - Send audio/message to AI
router.post('/message', (req, res) => {
  const { sessionId, audioData } = req.body

  const session = sessions.get(sessionId)
  if (!session) {
    return res.status(404).json({ error: 'Session not found' })
  }

  // Mock: Generate AI response
  // In production, this would:
  // 1. Send audio to Whisper for transcription
  // 2. Send transcript to Claude for response
  // 3. Send Claude's response to TTS

  const stage = determineStage(session.messages.length)
  const response = generateMockResponse(session, stage)

  session.messages.push({
    role: 'tutor',
    text: audioData || 'Mock transcript from audio',
    timestamp: new Date().toISOString()
  })

  session.messages.push({
    role: 'alex',
    text: response.text,
    timestamp: new Date().toISOString()
  })

  res.json({
    response: response.text,
    stage: response.stage,
    isEnd: response.isEnd
  })
})

// POST /api/interview/end - End interview session
router.post('/end', (req, res) => {
  const { sessionId } = req.body

  const session = sessions.get(sessionId)
  if (!session) {
    return res.status(404).json({ error: 'Session not found' })
  }

  session.status = 'completed'
  session.endedAt = new Date().toISOString()

  console.log(`🏁 Interview ended: ${sessionId}`)

  res.json({ sessionId, message: 'Interview completed' })
})

// POST /api/interview/chat - Dynamic AI Conversation
router.post('/chat', async (req, res) => {
  try {
    const { topic, conversationHistory } = req.body

    const systemPrompt = `You are Alex, a 10-year-old student taking a math lesson. 
The user is a tutor trying to teach you about: "${topic?.title || 'Math'} - ${topic?.description || 'Basic concepts'}".

Personality rules:
- You are curious, but easily confused by big words or abstract concepts.
- You get excited by real-world examples (like food, games, sports).
- Keep responses VERY short (1-2 sentences max). 
- Speak like a real 10-year-old. Do not use complex vocabulary.
- NEVER break character. You are NOT an AI assistant, you are Alex.
- If the tutor explains well, slowly start to understand. If they are confusing, express frustration or ask them to simplify.
- The interview should feel like a back and forth conversation.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'tutor' ? 'user' : 'assistant',
        content: msg.text
      }))
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 150
    })

    const reply = completion.choices[0].message.content
    res.json({ reply })

  } catch (error) {
    console.error('OpenAI Error:', error)
    res.status(500).json({ error: 'Failed to generate response' })
  }
})

// GET /api/interview/evaluation/:sessionId - Get evaluation for session
router.get('/evaluation/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId)

  if (!session) {
    return res.status(404).json({ error: 'Session not found' })
  }

  // Generate mock evaluation
  const evaluation = generateMockEvaluation(session)

  res.json(evaluation)
})

// Helper functions

function determineStage(messageCount) {
  // Simple mock logic for conversation stages
  if (messageCount < 2) return 'intro'
  if (messageCount < 4) return 'topic'
  if (messageCount < 6) return 'stress'
  if (messageCount < 8) return 'jargon'
  return 'wrapup'
}

function generateMockResponse(session, stage) {
  const responses = {
    intro: { text: mockAIResponses.intro, stage: 'intro', isEnd: false },
    topic: { text: mockAIResponses.topic(session.topic?.title || 'fractions'), stage: 'topic', isEnd: false },
    stress: { text: mockAIResponses.stress, stage: 'stress', isEnd: false },
    jargon: { text: mockAIResponses.jargon, stage: 'jargon', isEnd: false },
    wrapup: { text: mockAIResponses.wrapup, stage: 'wrapup', isEnd: false },
    end: { text: mockAIResponses.end, stage: 'end', isEnd: true }
  }

  return responses[stage] || responses.topic
}

function generateMockEvaluation(session) {
  // Generate realistic scores
  const warmthScore = Math.random() * 1 + 3.5 // 3.5-4.5
  const clarityScore = Math.random() * 1 + 3 // 3-4
  const patienceScore = Math.random() * 1.5 + 3 // 3-4.5
  const simplicityScore = Math.random() * 1 + 3.5 // 3.5-4.5
  const fluencyScore = Math.random() * 0.5 + 4.5 // 4.5-5

  const overallScore = ((warmthScore + clarityScore + patienceScore + simplicityScore + fluencyScore) / 5).toFixed(1)
  const verdict = overallScore >= 4 ? 'Strong Yes' : overallScore >= 3.5 ? 'Maybe' : 'No'

  const tutorMessages = session.messages.filter(m => m.role === 'tutor')

  return {
    sessionId: session.id,
    tutorId: session.tutorId,
    overallScore,
    verdict,
    dimensions: [
      { name: 'Warmth', score: warmthScore.toFixed(1), feedback: 'You showed genuine encouragement and support.' },
      { name: 'Clarity', score: clarityScore.toFixed(1), feedback: 'Your explanations were well-structured.' },
      { name: 'Patience', score: patienceScore.toFixed(1), feedback: 'You handled confused moments well.' },
      { name: 'Simplicity', score: simplicityScore.toFixed(1), feedback: 'Good use of simple language and analogies.' },
      { name: 'Fluency', score: fluencyScore.toFixed(1), feedback: 'Clear and professional communication.' },
    ],
    transcript: session.messages,
    bestQuotes: tutorMessages.slice(0, 3).map(m => m.text),
    topic: session.topic,
    generatedAt: new Date().toISOString()
  }
}

export default router
