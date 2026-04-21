import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { audioService } from '../services/audio'
import { API_BASE } from '../services/api'

export default function InterviewRoom() {
  const navigate = useNavigate()
  const location = useLocation()
  const topic = location.state?.topic

  const [stage, setStage] = useState('intro') // intro, topic, explanation, stress, jargon, wrapup, end
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState([])
  const [currentAIMessage, setCurrentAIMessage] = useState('')
  const [lastAIMessage, setLastAIMessage] = useState('')
  const [isAITalking, setIsAITalking] = useState(false)
  const [flashcards, setFlashcards] = useState([])
  const [error, setError] = useState(null)
  const tutorName = localStorage.getItem('tutorName') || 'Tutor'

  const conversationHistory = useRef([])

  useEffect(() => {
    if (!topic) {
      navigate('/topic')
      return
    }

    // Load voices
    if (audioService.synthesis) {
      audioService.synthesis.getVoices()
    }

    // Start intro after a short delay
    const timer = setTimeout(() => {
      const initialMessage = `Hi ${tutorName}! I'm Alex, and I'm 10 years old. Okay, so my teacher gave me this card but I don't get it... ${topic.description} Can you help me understand?`
      conversationHistory.current.push({ role: 'alex', text: initialMessage })
      setTranscript(prev => [...prev, { role: 'alex', text: initialMessage }])
      handleAISpeak(initialMessage, 'interviewing')
    }, 1000)

    return () => {
      clearTimeout(timer)
      audioService.stopSpeaking()
    }
  }, [])

  const handleAISpeak = (message, nextStage) => {
    setIsAITalking(true)
    setCurrentAIMessage(message)
    setError(null)

    audioService.speak(message, () => {
      setIsAITalking(false)
      setLastAIMessage(message) // Keep the last message visible
      setCurrentAIMessage('')
      if (nextStage) setStage(nextStage)
    })
  }

  const handleStartRecording = async () => {
    if (isAITalking || isTranscribing) return

    if (isRecording) {
      // Stop recording and transcribe
      const audioBlob = await audioService.stopRecording()
      setIsRecording(false)

      if (audioBlob && audioBlob.size > 0) {
        await transcribeAudio(audioBlob)
      }
      return
    }

    // Start recording
    const started = await audioService.startRecording()
    if (started) {
      setIsRecording(true)
      setError(null)
    } else {
      setError('Could not access microphone. Please allow microphone access.')
    }
  }

  const transcribeAudio = async (audioBlob) => {
    setIsTranscribing(true)
    setError(null)

    try {
      const text = await audioService.transcribe(audioBlob)
      console.log('Transcribed:', text)

      if (text && text.trim()) {
        // Add to transcript
        setTranscript(prev => [...prev, { role: 'tutor', text: text.trim() }])
        conversationHistory.current.push({ role: 'tutor', text: text.trim() })

        // Generate flashcards from response
        generateFlashcards(text.trim())

        // Process response and advance conversation
        processTutorResponse(text.trim())
      } else {
        setError('Could not hear anything. Please speak louder and try again.')
      }
    } catch (err) {
      console.error('Transcription failed:', err)
      setError('Transcription failed. Please try again.')
    }

    setIsTranscribing(false)
  }

  const processTutorResponse = async (text) => {
    setIsTranscribing(true) // Show processing state
    try {
      const response = await fetch(`${API_BASE}/interview/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          conversationHistory: conversationHistory.current
        })
      })

      if (!response.ok) throw new Error('Failed to get AI response')
      
      const data = await response.json()
      if (data.reply) {
        setTranscript(prev => [...prev, { role: 'alex', text: data.reply }])
        conversationHistory.current.push({ role: 'alex', text: data.reply })
        handleAISpeak(data.reply)
      }
    } catch (err) {
      console.error('Chat error:', err)
      setError('Alex got disconnected. Please try speaking again.')
    } finally {
      setIsTranscribing(false)
    }
  }

  const generateFlashcards = (text) => {
    // Simple mock flashcard generation based on tutor's response
    const newCards = []

    // Extract key concepts (simplified mock logic)
    if (text.includes('pizza') || text.includes('cake') || text.includes('food')) {
      newCards.push({
        type: 'example',
        front: 'Real-life example for fractions?',
        back: text.substring(text.indexOf('pizza') !== -1 ? text.indexOf('pizza') : text.indexOf('cake'), text.indexOf('pizza') !== -1 ? text.indexOf('pizza') + 20 : text.indexOf('cake') + 20).trim()
      })
    }

    if (text.includes('half') || text.includes('whole')) {
      newCards.push({
        type: 'definition',
        front: 'What is a fraction?',
        back: 'A way to show parts of a whole'
      })
    }

    if (newCards.length > 0) {
      setFlashcards(prev => [...prev, ...newCards])
    }
  }

  const handleEndInterview = () => {
    audioService.stopSpeaking()
    audioService.stopRecording()
    navigate('/evaluation', {
      state: {
        transcript: conversationHistory.current,
        flashcards,
        topic
      }
    })
  }

  const getStageInstructions = () => {
    if (stage === 'intro') return "Listen to Alex's introduction."
    return "Explain the topic to Alex, and adapt based on his responses!"
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/cuemath-logo-v2.png" alt="Cuemath Logo" className="h-8 w-auto" />
            <span className="font-sans text-[10px] text-black font-bold ml-1 tracking-tight">GENESIS</span>
            <span className="font-sans font-bold text-gray-800 ml-2">Live Interview</span>
          </div>
          <button
            onClick={handleEndInterview}
            className="text-gray-500 hover:text-gray-700 font-sans text-sm"
          >
            End Interview
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-sans text-sm">
            {error}
          </div>
        )}

        {/* Stage Indicator */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-sans font-medium text-gray-500">
              Stage {stage !== 'intro' && stage !== 'end' ? stage.charAt(0).toUpperCase() + stage.slice(1) : ''}
            </span>
            {isRecording && (
              <span className="flex items-center gap-2 text-red-500 text-sm font-sans">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Recording...
              </span>
            )}
            {isTranscribing && (
              <span className="flex items-center gap-2 text-blue-500 text-sm font-sans">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Transcribing...
              </span>
            )}
          </div>
          <p className="text-gray-700 font-sans">{getStageInstructions()}</p>
        </div>

        {/* Topic Card */}
        {topic && (
          <div className="bg-primary/5 rounded-xl p-4 mb-6 border border-primary/20">
            <p className="text-sm font-sans font-medium text-primary mb-1">Your Topic:</p>
            <p className="font-sans font-semibold text-gray-900">{topic.title}</p>
            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
          </div>
        )}

        {/* AI Message Bubble */}
        {(currentAIMessage || lastAIMessage) && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-md hover:shadow-xl transition-shadow duration-300 max-w-[80%]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">Alex</span>
              </div>
              <div className="flex-1">
                <p className="font-sans text-gray-800">
                  {currentAIMessage || lastAIMessage}
                </p>
                {isAITalking && (
                  <div className="mt-2 flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
            <p className="text-sm font-sans font-medium text-gray-500 mb-3">Transcript:</p>
            <div className="space-y-3">
              {transcript.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-2 ${entry.role === 'tutor' ? 'bg-accent' : 'bg-primary'}`}></span>
                  <p className={`font-sans text-sm ${entry.role === 'tutor' ? 'text-gray-800' : 'text-gray-600'}`}>
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flashcards Generated */}
        {flashcards.length > 0 && (
          <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
            <p className="text-sm font-sans font-medium text-green-700 mb-2">
              Flashcards Generated: {flashcards.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {flashcards.map((card, i) => (
                <span key={i} className="bg-white px-3 py-1 rounded-full text-xs font-sans text-gray-700 border border-green-200">
                  {card.type}: {card.front.substring(0, 20)}...
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center gap-4">
          {stage !== 'end' && (
            <button
              onClick={handleStartRecording}
              disabled={isAITalking || isTranscribing}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition shadow-lg ${
                isRecording
                  ? 'bg-red-500 animate-pulse'
                  : isTranscribing
                  ? 'bg-blue-500 cursor-wait'
                  : isAITalking
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {isRecording ? (
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : isTranscribing ? (
                <svg className="w-8 h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}

          {stage === 'end' && (
            <button
              onClick={handleEndInterview}
              className="bg-accent hover:bg-orange-500 text-white px-8 py-4 rounded-full font-sans font-semibold text-lg transition shadow-lg"
            >
              View Your Results
            </button>
          )}

          <p className="text-sm text-gray-500 font-sans">
            {isRecording ? 'Tap to stop & transcribe' : isTranscribing ? 'Processing...' : 'Tap to speak'}
          </p>
        </div>
      </main>
    </div>
  )
}
