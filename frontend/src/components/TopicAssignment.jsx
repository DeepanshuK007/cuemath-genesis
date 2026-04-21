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
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Your Interview Topic
          </h1>
          <p className="text-gray-600 font-sans">
            Here's the topic you'll be explaining in your interview.
            Take a moment to prepare your thoughts.
          </p>
        </div>

        {/* Topic Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-t-4 border-primary">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-sans font-semibold text-primary uppercase tracking-wide">
                Student Card
              </span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                {assignedTopic.title}
              </h2>
            </div>
          </div>
          <p className="text-gray-600 font-sans text-lg">
            {assignedTopic.description}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 rounded-xl p-6 mb-8">
          <h3 className="font-sans font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tips for Success
          </h3>
          <ul className="space-y-2 text-gray-700 font-sans text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Start with a real-life example the student can relate to
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Use simple words — avoid jargon unless you explain it
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Be patient and encouraging, like you would with a real student
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              Check if the student understands before moving on
            </li>
          </ul>
        </div>

        {/* Other Topics (for reference) */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 font-sans">
            Other topics you could have been asked:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {topics
              .filter(t => t.id !== assignedTopic.id)
              .slice(0, 4)
              .map(topic => (
                <span key={topic.id} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-sans">
                  {topic.title.substring(0, 30)}...
                </span>
              ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          disabled={isStarting}
          className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white py-4 rounded-lg font-sans font-semibold text-lg transition flex items-center justify-center gap-2"
        >
          {isStarting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Preparing Interview...
            </>
          ) : (
            <>
              Start Interview
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </>
          )}
        </button>
      </main>
    </div>
  )
}
