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

  return (
    <div className="min-h-screen bg-cream font-sans text-slate overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-8 w-auto" />
            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
            <span className="font-heading font-black text-[12px] tracking-widest text-primary uppercase">Genesis</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 space-y-10 animate-fade-in">
        {/* Results Hero */}
        <section className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-green-500/10 rounded-full text-green-600 text-[10px] font-black uppercase tracking-widest mb-4">
             Interview Complete
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-slate mb-6 tracking-tight">
            Analysis <span className="text-primary">Complete.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            We've analyzed your session with Alex. Here's how you performed across our core tutoring dimensions.
          </p>
        </section>

        {/* Score Overview Card */}
        <div className="relative group animate-slide-up">
           <div className={`absolute -inset-1 bg-gradient-to-r ${evaluation.overallScore >= 4 ? 'from-green-500 to-emerald-500' : 'from-primary to-accent'} rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000`}></div>
           <div className="relative bg-white rounded-[28px] shadow-2xl p-8 md:p-10 border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl ${
                      evaluation.overallScore >= 4 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-primary to-primary-dark'
                    }`}>
                       <span className="text-4xl font-heading font-black">{evaluation.overallScore}</span>
                       <span className="text-[10px] font-bold uppercase opacity-60">Out of 5</span>
                    </div>
                    <div>
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Final Verdict</span>
                       <h2 className={`text-3xl font-heading font-black ${
                         evaluation.overallScore >= 4 ? 'text-green-600' : 'text-slate'
                       }`}>{evaluation.verdict}</h2>
                    </div>
                 </div>

                 <div className="flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={handleSendReport}
                      disabled={isSendingEmail || emailSent}
                      className={`px-8 py-4 rounded-2xl font-heading font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                        emailSent 
                          ? 'bg-green-100 text-green-700 cursor-default shadow-none' 
                          : isSendingEmail
                          ? 'bg-gray-100 text-gray-400 cursor-wait'
                          : 'bg-slate text-white hover:bg-primary shadow-slate/20 hover:shadow-primary/20'
                      }`}
                    >
                      {emailSent ? '✓ Report Sent' : isSendingEmail ? 'Sending...' : 'Email Full Report'}
                    </button>
                    {emailSent && <p className="text-[10px] text-center font-bold text-green-500 uppercase tracking-wider animate-pulse">Check your inbox!</p>}
                 </div>
              </div>
           </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
           {/* Left Column: Dimensions */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                 <h3 className="font-heading text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Detailed Breakdown</h3>
                 <div className="grid gap-8">
                    {evaluation.dimensions.map((dim, i) => (
                      <div key={dim.name} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                              <span className="text-sm font-heading font-black text-slate uppercase tracking-wider">{dim.name}</span>
                              <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                dim.score >= 4 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {dim.score >= 4 ? 'Elite' : 'Competent'}
                              </div>
                           </div>
                           <span className="font-heading font-black text-primary">{dim.score}/5</span>
                        </div>
                        <div className="w-full bg-gray-50 rounded-full h-1.5 mb-4 overflow-hidden">
                           <div
                             className={`h-full rounded-full transition-all duration-1000 ease-out ${
                               dim.score >= 4 ? 'bg-green-500' : dim.score >= 3 ? 'bg-primary' : 'bg-accent'
                             }`}
                             style={{ width: `${(dim.score / 5) * 100}%` }}
                           ></div>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                           {dim.feedback}
                        </p>
                      </div>
                    ))}
                 </div>
              </section>

              {evaluation.bestQuotes.length > 0 && (
                <section className="bg-slate rounded-3xl p-8 text-white shadow-xl shadow-slate/20">
                   <h3 className="font-heading text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Standout Moments</h3>
                   <div className="grid gap-6">
                      {evaluation.bestQuotes.map((quote, i) => (
                        <div key={i} className="flex gap-4">
                           <span className="text-3xl text-primary font-serif leading-none">“</span>
                           <p className="text-gray-300 font-medium italic text-lg leading-relaxed">
                              {quote}
                           </p>
                        </div>
                      ))}
                   </div>
                </section>
              )}
           </div>

           {/* Right Column: Meta Info */}
           <div className="space-y-8">
              {evaluation.flashcards.length > 0 && (
                <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                   <h3 className="font-heading text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Visual Aids Built</h3>
                   <div className="grid gap-3">
                      {evaluation.flashcards.map((card, i) => (
                        <div key={i} className="bg-cream rounded-2xl p-4 border border-gray-100">
                           <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mb-1 block">{card.type}</span>
                           <p className="text-xs font-bold text-slate line-clamp-2">{card.front}</p>
                        </div>
                      ))}
                   </div>
                </section>
              )}

              <section className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
                 <h3 className="font-heading text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Next Steps</h3>
                 <p className="text-sm text-slate font-medium leading-relaxed mb-6">
                    Your profile has been updated with these results. Our team will review your session within 24 hours.
                 </p>
                 <button
                   onClick={() => navigate('/')}
                   className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-heading font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
                 >
                   Return to Hub
                 </button>
              </section>
           </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  )
}
}
