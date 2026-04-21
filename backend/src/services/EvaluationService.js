import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

const useGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10
const useGroq = !useGemini && process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.length > 10

const openai = useGroq
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })
  : new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const genAI = useGemini ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null
const model = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini'

class EvaluationService {
  async analyzeTranscript(transcript, topic) {
    try {
      const prompt = `You are an expert tutor evaluator for Cuemath, an elite math education platform.
Your job is to analyze the following transcript between a Tutor and a 10-year-old student named Alex.

Topic: ${topic?.title || 'Math Concept'}
Description: ${topic?.description || 'Teaching math to a child'}

Transcript:
${transcript.map(m => `${m.role === 'tutor' ? 'Tutor' : 'Alex'}: ${m.text}`).join('\n')}

Evaluate the tutor based on these 5 dimensions (Score each 1-5):
1. Warmth: Was the tutor encouraging and friendly?
2. Clarity: Was the explanation clear and easy to follow?
3. Patience: How did they handle Alex's confusion or frustration?
4. Simplicity: Did they avoid jargon and use good analogies?
5. Fluency: Was their English clear and professional?

Return your evaluation in JSON format EXACTLY as follows:
{
  "overallScore": "X.X",
  "verdict": "Strong Yes/Maybe/No",
  "dimensions": [
    { "name": "Warmth", "score": X, "feedback": "Detailed feedback..." },
    { "name": "Clarity", "score": X, "feedback": "Detailed feedback..." },
    { "name": "Patience", "score": X, "feedback": "Detailed feedback..." },
    { "name": "Simplicity", "score": X, "feedback": "Detailed feedback..." },
    { "name": "Fluency", "score": X, "feedback": "Detailed feedback..." }
  ],
  "bestQuotes": ["Quote 1", "Quote 2", "Quote 3"],
  "summary": "A brief overall summary of the performance."
}

Important:
- Scores should be realistic (not everyone gets 5/5).
- Feedback should be constructive and specific to what was said.
- "bestQuotes" should be the most impressive lines from the tutor.`

      let result

      if (useGemini) {
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const geminiResult = await geminiModel.generateContent(prompt)
        result = geminiResult.response.text()
      } else {
        const response = await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'system', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.5,
        })
        result = response.choices[0].message.content
      }

      return JSON.parse(result)
    } catch (error) {
      console.error('Evaluation Error:', error)
      throw new Error('Failed to analyze transcript')
    }
  }
}

export default new EvaluationService()
