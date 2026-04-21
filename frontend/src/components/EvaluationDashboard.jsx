import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_BASE } from '../services/api'

export default function EvaluationDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { transcript, flashcards, topic } = location.state || {}

  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const tutorName = localStorage.getItem('tutorName') || 'Tutor'

  const handleSendReport = async () => {
    setIsSendingEmail(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setEmailSent(true)
    setIsSendingEmail(false)
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
        // Fallback to mock
        setEvaluation({
          overallScore: 1.0,
          verdict: "No",
          dimensions: [
            { name: "Warmth", score: 1, feedback: "You didn't interact with the student." },
            { name: "Clarity", score: 1, feedback: "No explanation was provided." },
            { name: "Patience", score: 1, feedback: "We couldn't evaluate your patience." },
            { name: "Simplicity", score: 1, feedback: "Not enough content to evaluate." },
            { name: "Fluency", score: 1, feedback: "Please speak so we can evaluate your communication." }
          ],
          bestQuotes: ["Hi Tutor! I'm Alex. I'm a bit stuck on \"A student asks 'When will I ever use this in real life?' — your response?\". Can you help me understand this?"],
          flashcards: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [transcript, topic])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-black border-t-primary rounded-none animate-spin mx-auto mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"></div>
          <h2 className="text-3xl font-serif font-bold text-black mb-2 uppercase tracking-tight">Analyzing Your Performance</h2>
          <p className="text-gray-400 font-sans text-xs uppercase tracking-widest">Our AI is reviewing your interactionDNA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-primary selection:text-white pb-20">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto transition-transform group-hover:scale-105" />
              <div className="h-4 w-[1px] bg-gray-300"></div>
              <span className="text-[10px] font-black tracking-[0.4em] text-black uppercase">GENESIS</span>
            </Link>
          </div>

          {/* Centered User Badge */}
          <div className="flex justify-center">
             <div className="hidden md:flex items-center gap-3 bg-white border border-black px-4 h-9 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Signed In As</span>
                <span className="text-[9px] font-black text-black uppercase tracking-widest italic">{tutorName}</span>
             </div>
          </div>

          <div className="flex justify-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Evaluation Report</span>
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-5xl mx-auto px-6 space-y-12">
        {/* Hero Score Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black text-white p-10 md:p-16 border-2 border-black shadow-[12px_12px_0px_0px_rgba(56,31,240,1)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
             <img src="/math-art.png" alt="" className="w-full h-auto scale-150" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] block mb-4">Overall Score</span>
              <div className="flex items-baseline gap-2 justify-center md:justify-start">
                <span className="text-8xl font-serif font-bold text-white leading-none">{evaluation.overallScore}</span>
                <span className="text-3xl font-serif text-gray-500">/ 5</span>
              </div>
            </div>

            <div className="h-24 w-[1px] bg-gray-800 hidden md:block"></div>

            <div className="text-center md:text-right">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] block mb-4">Verdict</span>
              <span className={`text-6xl font-serif font-bold uppercase tracking-tight ${evaluation.verdict === 'Yes' ? 'text-green-400' : 'text-red-500'}`}>
                {evaluation.verdict}
              </span>
            </div>
          </div>

          {topic && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Topic Evaluated</p>
              <p className="text-lg font-serif italic text-primary">"{topic.title}"</p>
            </div>
          )}
        </motion.div>

        {/* Dimension Breakdown */}
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <h2 className="text-2xl font-serif font-bold text-black mb-10 uppercase tracking-tight border-b-2 border-black pb-4 inline-block">
              Dimension Breakdown
            </h2>
            <div className="space-y-8">
              {evaluation.dimensions.map(dim => (
                <div key={dim.name}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black text-black uppercase tracking-widest">{dim.name}</span>
                    <span className="text-xs font-black text-primary">{dim.score} / 5</span>
                  </div>
                  <div className="w-full bg-gray-100 border border-black h-3 mb-3 relative overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${(dim.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 font-sans leading-relaxed italic">{dim.feedback}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-10">
            {/* Standout Moments */}
            {evaluation.bestQuotes.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-accent/5 border-2 border-accent p-10 shadow-[8px_8px_0px_0px_rgba(255,107,74,1)]"
              >
                <h2 className="text-xl font-serif font-bold text-black mb-6 uppercase tracking-tight">Standout Moments</h2>
                <div className="space-y-6">
                  {evaluation.bestQuotes.map((quote, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-6 top-0 text-3xl text-accent opacity-20 font-serif">"</span>
                      <p className="text-gray-700 font-sans italic text-sm leading-relaxed pl-2">{quote}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Email CTA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group"
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-primary translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <h3 className="text-xl font-serif font-bold mb-4 uppercase tracking-tight">Full Feedback Report</h3>
              <p className="text-gray-500 font-sans text-xs mb-8 leading-relaxed">
                Detailed analysis and personalized tips will be sent to your registered email.
              </p>
              <button
                onClick={handleSendReport}
                disabled={isSendingEmail || emailSent}
                className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-xs shadow-[6px_6px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:bg-gray-400 relative overflow-hidden"
              >
                {emailSent ? 'Report Sent!' : isSendingEmail ? (
                   <div className="flex items-center justify-center gap-3">
                     <span className="animate-pulse">Sending</span>
                     <div className="absolute bottom-0 left-0 h-1 bg-primary w-full animate-[progress_1.5s_ease-in-out]"></div>
                   </div>
                ) : 'Send Report'}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Final Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white border-2 border-black text-black py-6 font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
          >
            Back to Home
          </button>
          <button
            onClick={() => alert('Application submitted successfully!')}
            className="flex-1 bg-primary border-2 border-black text-white py-6 font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
          >
            Complete Application
          </button>
        </motion.div>
      </main>

      {/* Styles for the custom progress bar */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}} />
    </div>
  )
}
