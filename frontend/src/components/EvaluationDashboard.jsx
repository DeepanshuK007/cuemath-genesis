import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { API_BASE } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function EvaluationDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { transcript, flashcards, topic } = location.state || {}

  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSendReport = async () => {
    if (!user?.email || !evaluation) {
      alert('Missing user email or evaluation data.')
      return
    }

    setIsSendingEmail(true)
    try {
      const response = await fetch(`${API_BASE}/email/send-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: user.name || user.email.split('@')[0],
          evaluation
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setEmailSent(true)
        if (data.simulated) {
          console.log('Email successfully simulated (add credentials to .env to actually send)')
        }
      } else {
        alert(data.error || 'Failed to send report.')
      }
    } catch (err) {
      console.error('Error sending report:', err)
      alert('Network error while sending report.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!transcript || transcript.length === 0) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/feedback/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript, topic })
        })

        if (!response.ok) throw new Error('Failed to fetch evaluation')
        
        const data = await response.json()
        setEvaluation(data)
      } catch (err) {
        console.error('Evaluation fetch error:', err)
        // Fallback to mock if API fails for some reason (to not break the UI)
        setEvaluation(generateMockEvaluation())
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [transcript, topic])

  const generateMockEvaluation = () => {
    const tutorResponses = transcript?.filter(t => t.role === 'tutor') || []
    const totalWords = tutorResponses.reduce((acc, t) => acc + t.text.split(/\s+/).length, 0)
    
    let warmthScore, clarityScore, patienceScore, simplicityScore, fluencyScore
    let feedbacks = {}

    if (tutorResponses.length === 0) {
      warmthScore = 1; clarityScore = 1; patienceScore = 1; simplicityScore = 1; fluencyScore = 1;
      feedbacks = {
        warmth: "You didn't interact with the student.",
        clarity: "No explanation was provided.",
        patience: "We couldn't evaluate your patience.",
        simplicity: "Not enough content to evaluate.",
        fluency: "Please speak so we can evaluate your communication."
      }
    } else if (totalWords < 20) {
      warmthScore = 2; clarityScore = 2; patienceScore = 2; simplicityScore = 2; fluencyScore = 3;
      feedbacks = {
        warmth: "Try to be more welcoming and encouraging.",
        clarity: "Your explanation was too brief to be helpful.",
        patience: "Try to spend more time guiding the student.",
        simplicity: "Your brief response didn't simplify the concept enough.",
        fluency: "Your English is okay, but please speak more."
      }
    } else {
      warmthScore = Math.floor(Math.random() * 2) + 3
      clarityScore = Math.floor(Math.random() * 2) + 3
      patienceScore = Math.floor(Math.random() * 2) + 3
      simplicityScore = Math.floor(Math.random() * 2) + 3
      fluencyScore = Math.floor(Math.random() * 2) + 4
      feedbacks = {
        warmth: "You showed genuine encouragement and support throughout the session.",
        clarity: "Your explanations were well-structured. Consider using more real-life examples.",
        patience: "You handled the confused student well. Good job staying calm!",
        simplicity: "You avoided most jargon. Try to use simpler analogies where possible.",
        fluency: "Your English communication was clear and professional."
      }
    }

    const overallScore = ((warmthScore + clarityScore + patienceScore + simplicityScore + fluencyScore) / 5).toFixed(1)
    const verdict = overallScore >= 4 ? 'Strong Yes' : overallScore >= 3 ? 'Maybe' : 'No'

    return {
      overallScore,
      verdict,
      dimensions: [
        { name: 'Warmth', score: warmthScore, feedback: feedbacks.warmth },
        { name: 'Clarity', score: clarityScore, feedback: feedbacks.clarity },
        { name: 'Patience', score: patienceScore, feedback: feedbacks.patience },
        { name: 'Simplicity', score: simplicityScore, feedback: feedbacks.simplicity },
        { name: 'Fluency', score: fluencyScore, feedback: feedbacks.fluency },
      ],
      bestQuotes: transcript?.slice(0, 2).map(t => t.text) || [],
      flashcards: flashcards || [],
      topic: topic,
    }
  }

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600 bg-green-50'
    if (score >= 3) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getVerdictColor = (verdict) => {
    if (verdict === 'Strong Yes') return 'bg-green-100 text-green-700 border-green-200'
    if (verdict === 'Maybe') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-600 font-sans">This only takes a moment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-2">
          <div className="flex items-center gap-2">
            <img src="/cuemath-logo-v2.png" alt="Cuemath Logo" className="h-10 w-auto" />
            <span className="font-sans text-[10px] text-black font-bold ml-1 tracking-tight">GENESIS</span>
            <span className="font-sans font-bold text-xl text-gray-800 ml-4">Your Results</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Overall Score */}
        <div className={`rounded-2xl p-8 border-2 ${getVerdictColor(evaluation.verdict)}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-sans text-sm font-medium opacity-75 mb-1">Overall Score</p>
              <p className="text-5xl font-serif font-bold">{evaluation.overallScore}<span className="text-2xl opacity-75">/5</span></p>
            </div>
            <div className="text-right">
              <p className="text-sm font-sans font-medium opacity-75 mb-1">Verdict</p>
              <p className="text-2xl font-serif font-bold">{evaluation.verdict}</p>
            </div>
          </div>

          {evaluation.topic && (
            <div className="border-t border-current border-opacity-20 pt-4">
              <p className="text-sm font-sans opacity-75">Topic: {evaluation.topic.title}</p>
            </div>
          )}
        </div>

        {/* Dimension Scores */}
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">Dimension Breakdown</h2>
          <div className="space-y-6">
            {evaluation.dimensions.map(dim => (
              <div key={dim.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans font-medium text-gray-800">{dim.name}</span>
                  <span className={`px-3 py-1 rounded-full font-sans font-semibold text-sm ${getScoreColor(dim.score)}`}>
                    {dim.score}/5
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full transition-all ${dim.score >= 4 ? 'bg-green-500' : dim.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(dim.score / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 font-sans">{dim.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Quotes */}
        {evaluation.bestQuotes.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Standout Moments</h2>
            <div className="space-y-4">
              {evaluation.bestQuotes.map((quote, i) => (
                <div key={i} className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-gray-700 font-sans italic">"{quote}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Flashcards */}
        {evaluation.flashcards.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Your Flashcards</h2>
            <p className="text-sm text-gray-600 font-sans mb-4">
              These were generated from your explanations during the interview.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {evaluation.flashcards.map((card, i) => (
                <div key={i} className="bg-cream rounded-lg p-4 border border-gray-200">
                  <span className={`text-xs font-sans font-semibold uppercase tracking-wide ${card.type === 'definition' ? 'text-blue-600' : card.type === 'example' ? 'text-green-600' : 'text-purple-600'}`}>
                    {card.type}
                  </span>
                  <p className="font-sans font-medium text-gray-800 mt-2">{card.front}</p>
                  <p className="text-sm text-gray-600 mt-1">{card.back}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Report CTA */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold mb-1">Get Your Full Feedback Report</h3>
              <p className="text-white/80 font-sans text-sm">
                Detailed analysis and personalized tips sent to your email.
              </p>
            </div>
            <button
              onClick={handleSendReport}
              disabled={isSendingEmail || emailSent}
              className={`px-6 py-3 rounded-lg font-sans font-semibold transition ${
                emailSent 
                  ? 'bg-green-100 text-green-700 cursor-default' 
                  : isSendingEmail
                  ? 'bg-cream/50 text-primary cursor-wait'
                  : 'bg-white text-primary hover:bg-cream'
              }`}
            >
              {emailSent ? 'Report Sent!' : isSendingEmail ? 'Sending...' : 'Send Report'}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-lg font-sans font-semibold transition"
          >
            Back to Home
          </button>
          <button
            onClick={() => alert('Thank you for applying! We will be in touch soon. (Demo)')}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-lg font-sans font-semibold transition"
          >
            Complete Application
          </button>
        </div>
      </main>
    </div>
  )
}
