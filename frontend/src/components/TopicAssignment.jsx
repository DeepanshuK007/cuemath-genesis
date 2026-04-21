import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomTopic, topics } from '../data/topics'
import { api } from '../services/api'

export default function TopicAssignment() {
  const navigate = useNavigate()
  const [assignedTopic, setAssignedTopic] = useState(null)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    // Assign a random topic when component loads
    const topic = getRandomTopic()
    setAssignedTopic(topic)
  }, [])

  const handleStartInterview = async () => {
    setIsStarting(true)
    const tutorId = localStorage.getItem('tutorId')
    const topicId = assignedTopic?.id

    if (tutorId && topicId) {
      try {
        await api.startInterview(tutorId, topicId)
      } catch (err) {
        console.error('Failed to start interview:', err)
      }
    }

    navigate('/interview', { state: { topic: assignedTopic } })
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col">
        <div className="text-center mb-10 animate-slide-down">
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-4">
             Mission Preparation
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-slate mb-6 tracking-tight">
            Meet your student, <span className="text-primary">Alex.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Alex is a curious 10-year-old who needs your help. Here is the card he's been struggling with today.
          </p>
        </div>

        {/* Topic Card */}
        <div className="relative group animate-scale-up">
           <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
           <div className="relative bg-white rounded-[28px] shadow-2xl p-8 md:p-12 border border-gray-100 mb-10 overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                 </div>
              </div>

              <div className="max-w-2xl">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] block mb-4">Interview Challenge</span>
                <h2 className="text-3xl font-heading font-black text-slate mb-6">
                  {assignedTopic.title}
                </h2>
                <div className="h-1 w-20 bg-accent rounded-full mb-8"></div>
                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  "{assignedTopic.description}"
                </p>
              </div>
           </div>
        </div>

        {/* Tips & Start */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
           <div className="bg-slate rounded-3xl p-8 text-white shadow-xl animate-slide-left">
              <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                 <span className="text-accent text-2xl">★</span> Success Strategy
              </h3>
              <ul className="space-y-4">
                 {[
                   "Start with a familiar real-life analogy",
                   "Avoid technical jargon where possible",
                   "Stay patient when Alex gets confused",
                   "Check for understanding frequently"
                 ].map((tip, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5"></div>
                      {tip}
                   </li>
                 ))}
              </ul>
           </div>

           <div className="flex flex-col gap-4 animate-slide-right">
              <button
                onClick={handleStartInterview}
                disabled={isStarting}
                className="group relative w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white py-6 rounded-3xl font-heading font-black text-xl transition-all shadow-2xl hover:shadow-primary/40 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
              >
                {isStarting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Preparing Room...
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Start Teaching Alex</span>
                    <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                System: Speech Recognition Ready
              </p>
           </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-down { animation: slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-left { animation: slide-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-right { animation: slide-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-up { animation: scale-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  )
}
}
