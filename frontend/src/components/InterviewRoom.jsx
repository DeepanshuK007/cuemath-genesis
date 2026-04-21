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

        // Advance stage if backend provides it
        if (data.stage) setStage(data.stage)
        if (data.isEnd) setStage('end')

        handleAISpeak(data.reply)
      }
    } catch (err) {
      console.error('Chat error:', err)
      const msg = err.message || 'Alex got disconnected.'
      setError(`Error: ${msg}. Check if your API Key is valid in the backend .env file.`)
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
    <div className="min-h-screen bg-cream flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-3 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto" />
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="text-[10px] font-black tracking-widest text-black uppercase">Genesis</span>
          </div>
          <button
            onClick={handleEndInterview}
            className="border border-black px-4 py-1.5 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
          >
            End Session
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full grid md:grid-cols-[300px_1fr] gap-8 p-8">
        {/* Left Sidebar: Context */}
        <aside className="space-y-6">
          <div className="border border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-2">Active Topic</span>
            <h2 className="text-xl font-serif font-bold text-black mb-3">{topic?.title}</h2>
            <p className="text-xs text-gray-500 leading-relaxed">{topic?.description}</p>
          </div>

          <div className="border border-black bg-gray-50 p-6">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-2">Stage</span>
             <p className="text-xs font-bold text-black uppercase tracking-tight">
                {stage === 'intro' ? 'Introduction' : stage.replace('_', ' ')}
             </p>
          </div>

          {flashcards.length > 0 && (
            <div className="border border-primary/20 bg-primary/5 p-6 animate-fade-in">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-2">Visual Aids Built</span>
              <div className="space-y-2">
                {flashcards.slice(-2).map((card, i) => (
                  <div key={i} className="text-[10px] font-medium text-primary-dark truncate bg-white/50 px-2 py-1">
                    {card.type}: {card.front}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Content: Interaction */}
        <div className="flex flex-col">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-xs font-bold text-red-700 uppercase tracking-tight">
              {error}
            </div>
          )}

          {/* Alex's Message Area */}
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="relative mb-12">
               <div className={`w-32 h-32 rounded-none border-2 border-black flex items-center justify-center transition-all duration-500 bg-white ${isAITalking ? 'shadow-[8px_8px_0px_0px_rgba(255,107,74,1)] scale-105' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                  <span className="text-4xl">👦</span>
               </div>
               {isAITalking && (
                 <div className="absolute -top-4 -right-4 bg-accent text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest animate-bounce">
                    Talking...
                 </div>
               )}
            </div>

            <div className="max-w-lg text-center">
              <p className="text-xl md:text-2xl font-serif font-medium text-black leading-snug mb-8">
                {currentAIMessage || lastAIMessage || "Waiting for Alex..."}
              </p>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="border-t border-gray-100 pt-12 pb-6 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
               {stage !== 'end' ? (
                 <button
                   onClick={handleStartRecording}
                   disabled={isAITalking || isTranscribing}
                   className={`w-24 h-24 rounded-none border-2 border-black flex items-center justify-center transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                     isRecording ? 'bg-red-500' : isTranscribing ? 'bg-blue-500 cursor-wait' : 'bg-primary hover:bg-primary-dark'
                   } disabled:bg-gray-100 disabled:shadow-none disabled:border-gray-200`}
                 >
                   {isRecording ? (
                     <div className="w-8 h-8 bg-white"></div>
                   ) : isTranscribing ? (
                     <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                     </svg>
                   )}
                 </button>
               ) : (
                 <button
                   onClick={handleEndInterview}
                   className="bg-black text-white px-10 py-5 font-black uppercase tracking-widest text-xl shadow-[8px_8px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                 >
                   View Final Report
                 </button>
               )}
            </div>
            
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
               {isRecording ? 'Tap to finish' : isTranscribing ? 'Processing...' : 'Click mic to explain'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
