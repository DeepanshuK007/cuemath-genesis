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
  const [canEnd, setCanEnd] = useState(false)
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
      const initialMessage = `Hi ${tutorName}! I'm Alex. I'm a bit stuck on "${topic.title}". Can you help me understand this?`
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

        if (data.isEnd || data.stage === 'end') {
          setStage('end')
          setCanEnd(true)
          console.log('You can end interview')
        }

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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto" />
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="text-[10px] font-black tracking-[0.4em] text-black uppercase">GENESIS</span>
          </div>

          {/* Centered User Badge */}
          <div className="flex justify-center">
             <div className="hidden md:flex items-center gap-3 bg-white border border-black px-4 h-9 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Signed In As</span>
                <span className="text-[9px] font-black text-black uppercase tracking-widest">{tutorName}</span>
             </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (canEnd) {
                  handleEndInterview()
                } else {
                  if (window.confirm("Alex hasn't finished yet. Ending now might affect your evaluation. Are you sure?")) {
                    handleEndInterview()
                  }
                }
              }}
              className={`border border-black px-6 py-2 transition-all text-[10px] font-black uppercase tracking-widest h-10 flex items-center ${canEnd ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
            >
              End Session
            </button>
          </div>
        </div>
      </header>

      <main className="pt-28 flex-1 max-w-6xl mx-auto w-full grid md:grid-cols-[280px_1fr] gap-12 p-8">
        {/* Left Sidebar: Context */}
        <aside className="space-y-6">
          <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] block mb-2">Topic</span>
            <h2 className="text-xl font-serif font-bold text-black mb-3 leading-tight">{topic?.title}</h2>
            <div className="h-[1px] bg-gray-100 w-full mb-3"></div>
            <p className="text-[11px] text-gray-500 leading-relaxed italic">"{topic?.description}"</p>
          </div>

          <div className="border-2 border-black bg-gray-50 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] block mb-2">Current Stage</span>
             <p className="text-xs font-black text-black uppercase tracking-widest">
                {stage === 'intro' ? 'Intro' : stage.replace('_', ' ')}
             </p>
          </div>
        </aside>

        {/* Right Content: Interaction Area */}
        <div className="flex flex-col h-full border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          {/* Background Decorative Art */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none">
             <img src="/math-art.png" alt="" className="w-full h-auto" />
          </div>

          {error && (
            <div className="bg-red-50 border-b-2 border-red-500 p-3 text-[9px] font-black text-red-700 uppercase tracking-widest text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Alex's Message Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-8">
               <div className={`w-24 h-24 rounded-none border-2 border-black flex items-center justify-center transition-all duration-500 bg-white ${isAITalking ? 'shadow-[6px_6px_0px_0px_rgba(255,107,74,1)] scale-105' : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'}`}>
                  <span className="text-4xl">👦</span>
               </div>
               {isAITalking && (
                 <div className="absolute -top-3 -right-3 bg-accent text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest animate-bounce">
                    Speaking
                 </div>
               )}
            </div>

            <div className="max-w-md mx-auto">
              <p className="text-xl md:text-2xl font-serif font-medium text-black leading-tight italic">
                "{currentAIMessage || lastAIMessage || "Ready when you are..."}"
              </p>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="border-t-2 border-black p-6 flex flex-col items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-4">
               {stage !== 'end' ? (
                 <button
                   onClick={handleStartRecording}
                   disabled={isAITalking || isTranscribing}
                   className={`w-28 h-28 rounded-none border-4 border-black flex items-center justify-center transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2 ${
                     isRecording ? 'bg-red-500' : isTranscribing ? 'bg-blue-500 cursor-wait' : 'bg-primary hover:bg-primary-dark'
                   } disabled:bg-gray-100 disabled:shadow-none disabled:border-gray-300`}
                 >
                   {isRecording ? (
                     <div className="w-10 h-10 bg-white"></div>
                   ) : isTranscribing ? (
                     <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                   ) : (
                     <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                     </svg>
                   )}
                 </button>
               ) : (
                 <button
                   onClick={handleEndInterview}
                   className="bg-black text-white px-12 py-6 font-black uppercase tracking-widest text-2xl shadow-[10px_10px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                 >
                   View Results
                 </button>
               )}
            </div>
            
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">
               {isRecording ? 'Stop' : isTranscribing ? 'Analyzing' : 'Explain to Alex'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
