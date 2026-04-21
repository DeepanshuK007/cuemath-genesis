import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

class EvaluationService {
  async analyzeTranscript(transcript, topic) {
    // Diagnostic Logs (Safe)
    console.log('🔍 Evaluation AI Service Check:', {
      hasGeminiKey: !!process.env.GEMINI_API_KEY
    })

    try {
      const prompt = `You are the lead pedagogical evaluator for Cuemath Genesis, the world's most elite AI-powered tutor screening platform.
Your task is to perform a high-fidelity audit of a tutor candidate's performance based on the following transcript.

Candidate Context:
Topic: ${topic?.title || 'Math Concept'}
Description: ${topic?.description || 'Teaching math to a child'}

Transcript:
${transcript.map(m => `${m.role === 'tutor' ? 'TUTOR' : 'ALEX (Student)'}: ${m.text}`).join('\n')}

--- EVALUATION PROTOCOL ---
You must evaluate the tutor against the 6 core pillars of the "Cuemath Teaching DNA". Be rigorous and precise.

1. ❤️ WARMTH: Did they create a safe, supportive environment? (1-5)
2. 💎 CLARITY: Did they explain complex ideas with surgical precision? (1-5)
3. 🧘 PATIENCE: Did they stay calm and supportive when Alex struggled? (1-5)
4. 🧩 SIMPLICITY: Did they avoid jargon and use relatable, real-world examples? (1-5)
5. 🗣️ FLUENCY: Was their communication confident, professional, and clear? (1-5)
6. 🔥 PASSION: Did they show genuine excitement for math and teaching? (1-5)

Return your evaluation in JSON format EXACTLY as follows:
{
  "overallScore": "X.X",
  "verdict": "Yes/Maybe/No",
  "dimensions": [
    { "name": "Warmth", "score": X, "feedback": "Detailed pedagogical analysis..." },
    { "name": "Clarity", "score": X, "feedback": "Detailed pedagogical analysis..." },
    { "name": "Patience", "score": X, "feedback": "Detailed pedagogical analysis..." },
    { "name": "Simplicity", "score": X, "feedback": "Detailed pedagogical analysis..." },
    { "name": "Fluency", "score": X, "feedback": "Detailed pedagogical analysis..." },
    { "name": "Passion", "score": X, "feedback": "Detailed pedagogical analysis..." }
  ],
  "bestQuotes": ["Most impressive pedagogical line 1", "Line 2", "Line 3"],
  "summary": "A deep-dive summary of why this candidate should or should not join the elite."
}

Scoring Rubric:
- 5: World-class. Master of the craft.
- 4: Strong, but room for minor polish.
- 3: Average. Meets basic requirements.
- 2: Weak. Lacks pedagogical depth.
- 1: Unacceptable. No interaction or total failure.

NOTE: If the tutor provides a one-sentence answer, they cannot score above a 2 in any category. We value depth and "Math Fun".`

      const geminiModel = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
      const geminiResult = await geminiModel.generateContent(prompt)
      let result = geminiResult.response.text()
      
      // Basic cleanup in case Gemini adds markdown blocks
      result = result.replace(/```json/g, '').replace(/```/g, '').trim()

      return JSON.parse(result)
    } catch (error) {
      console.error('Evaluation Error:', error)
      throw new Error('Failed to analyze transcript')
    }
  }
}

export default new EvaluationService()
