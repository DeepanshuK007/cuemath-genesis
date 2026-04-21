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

  if (!assignedTopic) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Preparing your interview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-2">
          <div className="flex items-center gap-2">
            <img src="/cuemath-logo-v2.png" alt="Cuemath Logo" className="h-10 w-auto" />
            <span className="font-sans text-[10px] text-black font-bold ml-1 tracking-tight">GENESIS</span>
          </div>
        </div>
      </header>

      {/* Topic Assignment */}
      <main className="max-w-xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </button>

        <div className="bg-white rounded-none border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-10 mb-10">
          <div className="mb-8">
            <span className="inline-block bg-primary text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-4">
              Mission Assignment
            </span>
            <h1 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
              {assignedTopic.title}
            </h1>
          </div>
          
          <div className="prose prose-slate mb-10">
            <p className="text-gray-600 font-sans text-lg leading-relaxed">
              {assignedTopic.description}
            </p>
          </div>

          <div className="border-t-2 border-black pt-8">
            <h3 className="text-xs font-black text-black uppercase tracking-widest mb-4">Quick Preparation Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans font-bold text-gray-500 uppercase tracking-tight">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary"></div>
                Use real-life examples
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary"></div>
                Avoid complex jargon
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary"></div>
                Stay patient & kind
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary"></div>
                Check for understanding
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          disabled={isStarting}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-5 rounded-none font-sans font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
        >
          {isStarting ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              Preparing Session...
            </>
          ) : (
            <>
              Launch Interview
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </main>
    </div>
  )
}
