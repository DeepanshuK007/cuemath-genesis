import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// In-memory storage
const sessions = new Map()
const evaluations = new Map()

// Topics bank
const topics = [
  // Conceptual Topics
  { id: 1, title: "The 'Pizza' Fractions", description: "Explain why 3/4 of a pizza is more than 2/3, even though 3 is more than 2." },
  { id: 2, title: "The Mystery of X", description: "Explain what a 'Variable' is (like in 5 + x = 10) without using math jargon." },
  { id: 3, title: "Decimal Power", description: "Why does 0.5 mean the same thing as 1/2? Explain using money." },
  { id: 4, title: "The Elevator Math", description: "Explain negative numbers using an elevator going down to a basement." },
  { id: 5, title: "Area vs. Perimeter", description: "Explain the difference using a garden fence and the grass inside." },
  { id: 6, title: "The 'Why' of Division", description: "Why can't we divide a number by zero? Use a bag of candies as an analogy." },
  { id: 7, title: "Ratio & Proportions", description: "Explain ratios using a recipe for making the perfect chocolate milk." },
  { id: 8, title: "The Zero Property", description: "Why is any number multiplied by zero always zero? Explain to a curious child." },
  { id: 9, title: "Probability Basics", description: "Explain the chance of winning a game using a bag of colored marbles." },
  { id: 10, title: "Order of Operations", description: "Why do we have to do multiplication before addition? Use a 'Secret Code' analogy." },

  // Behavioral/Tutoring Scenarios
  { id: 11, title: "The 'I Hate Math' Wall", description: "A student says 'I'm just not a math person.' How do you change their mind?" },
  { id: 12, title: "The Frozen Student", description: "A student has been staring at a problem for 5 minutes and is about to cry. What do you say?" },
  { id: 13, title: "The 'When Will I Use This?'", description: "The student asks why they need to learn long division in the age of calculators." },
  { id: 14, title: "The Persistent Error", description: "A student keeps saying 7 x 8 is 54. How do you help them find the right answer without just telling them?" },
  { id: 15, title: "The Jargon Trap", description: "You accidentally used the word 'Denominator'. Now explain it like it's a superhero name." },
  { id: 16, title: "The Speedster", description: "A student is rushing through work and making 'silly' mistakes. How do you slow them down?" },
  { id: 17, title: "The Silent Learner", description: "The student is very shy and only gives one-word answers. How do you get them to explain their thinking?" },
  { id: 18, title: "The Overwhelmed Mind", description: "A student says 'This is too much, I'll never get it.' Break down a 3-step problem for them." },
  { id: 19, title: "The Competitive Spirit", description: "A student is upset because they are slower than their friends. How do you encourage them?" },
  { id: 20, title: "The 'Aha!' Moment", description: "Help a student finally 'see' why a square is also a rectangle." }
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
    // Diagnostic Logs (Safe)
    console.log('🔍 AI Service Check:', {
      hasGemini: !!process.env.GEMINI_API_KEY,
      geminiLength: process.env.GEMINI_API_KEY?.length || 0,
      hasGroq: !!process.env.GROQ_API_KEY,
      groqLength: process.env.GROQ_API_KEY?.length || 0
    })

    const useGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10
    const useGroq = !useGemini && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 10

    let reply

    if (useGemini) {
      // Use Gemini
      console.log('🤖 Using Gemini AI')
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const systemPrompt = `You are Alex, a 10-year-old student taking a math lesson.
The user is a tutor candidate. Your goal is to have a natural conversation and eventually learn about: "${topic?.title || 'Math'}".

INTERVIEW STAGES:
1. GREETING/INTERESTS: If the conversation just started, respond to their greeting. Ask about their hobbies or interests. Mention you like video games.
2. TOPIC INTRO: If you've already chatted a bit, ask: "Can you explain ${topic?.title} to me? My teacher said it's important."
3. LEARNING: Let the tutor explain.
   - If they use a complex word, ask: "Wait, what does that big word mean?"
   - If they give a real-life example, say: "Oh, that makes sense! Like when I..." (give a small example)
4. STRESS TEST: After 4-5 messages of explanation, say: "I'm still a bit confused... this feels too hard. Why is it so confusing?"
5. CLOSURE: If they explain well and you've had a good talk, say: "Oh! I think I get it now! You're a great teacher. Thank you!"

PERSONALITY RULES:
- Speak like a real 10-year-old. Short sentences, simple words.
- Be curious, slightly hesitant, and easily distracted.
- Keep responses VERY short (1-2 sentences max).
- NEVER break character. You are Alex.
- Respond naturally to what the tutor says. If they already introduced themselves, don't ask for their name again.`

      const chatHistory = conversationHistory.map(msg => ({
        role: msg.role === 'tutor' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }))

      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          { role: 'model', parts: [{ text: "Hi! I'm Alex, I'm 10 years old. What's your name?" }] }
        ],
        generationConfig: { maxOutputTokens: 150, temperature: 0.8 }
      })

      const result = await chat.sendMessage(conversationHistory[conversationHistory.length - 1]?.text || 'Hi')
      reply = result.response.text()

    } else if (useGroq) {
      // Use Groq
      console.log('🤖 Using Groq AI')
      const aiClient = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })

      const systemPrompt = `You are Alex, a 10-year-old student taking a math lesson.
The user is a tutor candidate. Your goal is to have a natural conversation and eventually learn about: "${topic?.title || 'Math'}".

INTERVIEW STAGES:
1. GREETING/INTERESTS: If the conversation just started, respond to their greeting. Ask about their hobbies or interests. Mention you like video games.
2. TOPIC INTRO: If you've already chatted a bit, ask: "Can you explain ${topic?.title} to me? My teacher said it's important."
3. LEARNING: Let the tutor explain.
   - If they use a complex word, ask: "Wait, what does that big word mean?"
   - If they give a real-life example, say: "Oh, that makes sense! Like when I..." (give a small example)
4. STRESS TEST: After 4-5 messages of explanation, say: "I'm still a bit confused... this feels too hard. Why is it so confusing?"
5. CLOSURE: If they explain well and you've had a good talk, say: "Oh! I think I get it now! You're a great teacher. Thank you!"

PERSONALITY RULES:
- Speak like a real 10-year-old. Short sentences, simple words.
- Be curious, slightly hesitant, and easily distracted.
- Keep responses VERY short (1-2 sentences max).
- NEVER break character. You are Alex.
- Respond naturally to what the tutor says. If they already introduced themselves, don't ask for their name again.`

      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'tutor' ? 'user' : 'assistant',
          content: msg.text
        }))
      ]

      const completion = await aiClient.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.8,
        max_tokens: 150
      })

      reply = completion.choices[0].message.content

    } else {
      // Fallback to mock
      console.log('⚠️ Using Mock Fallback (no AI API key configured)')
      const tutorMsg = conversationHistory[conversationHistory.length - 1]?.text?.toLowerCase() || ''
      reply = "That sounds interesting! Can you tell me more?"

      if (tutorMsg.includes('hi') || tutorMsg.includes('hello')) {
        reply = "Hi! I'm Alex. I'm 10 years old. What's your name?"
      } else if (tutorMsg.includes('name is') || tutorMsg.includes('i am')) {
        reply = "Nice to meet you! Do you like video games? I love them! Also, can you help me with my math homework?"
      } else if (tutorMsg.includes('yes') || tutorMsg.includes('sure') || tutorMsg.includes('topic')) {
        reply = `Okay! My teacher said I need to learn about ${topic?.title || 'this topic'}. Can you explain it simply?`
      } else if (tutorMsg.length > 50) {
        reply = "Wait, that's a lot of big words... I'm a bit confused. Can you say it like I'm a kid?"
      } else if (tutorMsg.includes('pizza') || tutorMsg.includes('cake')) {
        reply = "Oh! I love pizza! That makes the math much easier to understand. What happens next?"
      }
    }

    console.log(`✅ Alex replied: ${reply}`)
    res.json({ reply })

  } catch (error) {
    console.error('❌ AI Chat Error:', error.message)

    // Fallback logic for Demo Mode (if API fails or quota exceeded)
    console.log('⚠️ Using Mock Fallback because API failed...')
    const tutorMsg = conversationHistory[conversationHistory.length - 1]?.text?.toLowerCase() || ''
    let reply = "That sounds interesting! Can you tell me more?"

    if (tutorMsg.includes('hi') || tutorMsg.includes('hello')) {
      reply = "Hi! I'm Alex. I'm 10 years old. What's your name?"
    } else if (tutorMsg.includes('name is') || tutorMsg.includes('i am')) {
      reply = "Nice to meet you! Do you like video games? I love them! Also, can you help me with my math homework?"
    } else if (tutorMsg.includes('yes') || tutorMsg.includes('sure') || tutorMsg.includes('topic')) {
      reply = `Okay! My teacher said I need to learn about ${topic?.title || 'this topic'}. Can you explain it simply?`
    } else if (tutorMsg.length > 50) {
      reply = "Wait, that's a lot of big words... I'm a bit confused. Can you say it like I'm a kid?"
    } else if (tutorMsg.includes('pizza') || tutorMsg.includes('cake')) {
      reply = "Oh! I love pizza! That makes the math much easier to understand. What happens next?"
    }

    res.json({ reply, note: 'Demo mode fallback (API error)' })
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
