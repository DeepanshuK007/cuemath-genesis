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
    <div className="min-h-screen bg-cream flex flex-col font-sans text-slate overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-7 w-auto" />
            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
            <span className="font-heading font-black text-[11px] tracking-widest text-primary uppercase">Genesis</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
               <div className="w-2 h-2 bg-primary rounded-full pulse-ring"></div>
               <span className="text-xs font-bold text-primary uppercase tracking-wider">Live Session</span>
             </div>
             <button
              onClick={handleEndInterview}
              className="text-gray-400 hover:text-red-500 font-semibold text-sm transition-colors"
            >
              Quit Session
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full overflow-hidden">
        {/* Left Sidebar: Mission Control */}
        <aside className="w-[320px] border-r border-gray-100 p-8 flex flex-col gap-8 hidden lg:flex bg-white/50">
          <section>
            <h3 className="font-heading text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Current Mission</h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h4 className="font-heading text-lg text-primary mb-2">{topic?.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed italic">
                "{topic?.description}"
              </p>
            </div>
          </section>

          <section className="flex-1 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
               <h3 className="font-heading text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Session Progress</h3>
               <div className="flex flex-col gap-2">
                 {['Introduction', 'Topic Explanation', 'Stress Test', 'Conclusion'].map((s, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                       (i === 0 && stage === 'intro') || (i === 1 && (stage === 'topic' || stage === 'explanation' || stage === 'jargon')) || (i === 2 && stage === 'stress') || (i === 3 && (stage === 'wrapup' || stage === 'end'))
                       ? 'bg-primary text-white shadow-lg shadow-primary/30'
                       : 'bg-gray-100 text-gray-400'
                     }`}>
                       {i + 1}
                     </div>
                     <span className={`text-sm font-semibold ${
                        (i === 0 && stage === 'intro') || (i === 1 && (stage === 'topic' || stage === 'explanation' || stage === 'jargon')) || (i === 2 && stage === 'stress') || (i === 3 && (stage === 'wrapup' || stage === 'end'))
                        ? 'text-slate'
                        : 'text-gray-300'
                     }`}>{s}</span>
                   </div>
                 ))}
               </div>
            </div>

            {flashcards.length > 0 && (
              <div className="mt-4">
                <h3 className="font-heading text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Concepts Captured</h3>
                <div className="flex flex-col gap-2">
                  {flashcards.map((card, i) => (
                    <div key={i} className="bg-green-50 border border-green-100 p-3 rounded-xl animate-fade-in">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">{card.type}</p>
                      <p className="text-xs text-green-800 font-medium line-clamp-2">{card.front}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="bg-primary rounded-2xl p-5 text-white shadow-xl shadow-primary/20">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Instructions</p>
             <p className="text-sm font-medium leading-relaxed">
               {getStageInstructions()}
             </p>
          </div>
        </aside>

        {/* Main Area: The Interaction */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3 animate-shake">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500">!</div>
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Conversation Flow */}
            <div className="max-w-2xl mx-auto w-full flex flex-col gap-10 py-10">
              {transcript.map((entry, i) => (
                <div key={i} className={`flex items-start gap-5 ${entry.role === 'tutor' ? 'flex-row-reverse' : ''} animate-slide-up`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                    entry.role === 'tutor' 
                    ? 'bg-slate text-white' 
                    : 'bg-gradient-to-br from-accent to-orange-500 text-white'
                  }`}>
                    {entry.role === 'tutor' ? tutorName.charAt(0) : 'A'}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[80%] ${entry.role === 'tutor' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {entry.role === 'tutor' ? 'You' : 'Alex'}
                    </span>
                    <div className={`px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                      entry.role === 'tutor' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-gray-50 text-slate border border-gray-100 rounded-tl-none'
                    }`}>
                      {entry.text}
                    </div>
                  </div>
                </div>
              ))}

              {isAITalking && currentAIMessage && (
                <div className="flex items-start gap-5 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                    A
                  </div>
                  <div className="flex flex-col gap-2 max-w-[80%] items-start">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alex is talking...</span>
                    <div className="px-6 py-4 rounded-2xl rounded-tl-none text-[15px] leading-relaxed bg-accent/5 text-slate border border-accent/20 italic">
                      {currentAIMessage}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: Interaction Controls */}
          <div className="p-8 bg-gray-50/50 backdrop-blur-sm border-t border-gray-100">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
              
              {/* Interaction State */}
              <div className="flex items-center gap-4">
                 {isRecording ? (
                    <div className="px-4 py-1.5 bg-red-500 rounded-full flex items-center gap-2 shadow-lg shadow-red-200">
                       <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                       <span className="text-xs font-black text-white uppercase tracking-widest">Alex is listening</span>
                    </div>
                 ) : isTranscribing ? (
                    <div className="px-4 py-1.5 bg-primary rounded-full flex items-center gap-2 shadow-lg shadow-primary/20">
                       <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                       <span className="text-xs font-black text-white uppercase tracking-widest">Alex is thinking</span>
                    </div>
                 ) : isAITalking ? (
                    <div className="px-4 py-1.5 bg-accent rounded-full flex items-center gap-2 shadow-lg shadow-accent/20">
                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                       <span className="text-xs font-black text-white uppercase tracking-widest">Alex is speaking</span>
                    </div>
                 ) : (
                    <div className="px-4 py-1.5 bg-white border border-gray-200 rounded-full flex items-center gap-2 shadow-sm">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Turn</span>
                    </div>
                 )}
              </div>

              {stage !== 'end' ? (
                <div className="relative group">
                  {/* Decorative pulse ring when active */}
                  {isRecording && <div className="absolute inset-0 bg-red-500 rounded-full pulse-ring -z-10 scale-125"></div>}
                  
                  <button
                    onClick={handleStartRecording}
                    disabled={isAITalking || isTranscribing}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl active:scale-95 ${
                      isRecording
                        ? 'bg-red-500 rotate-90'
                        : isTranscribing
                        ? 'bg-primary cursor-wait'
                        : isAITalking
                        ? 'bg-gray-100 cursor-not-allowed opacity-50'
                        : 'bg-primary hover:scale-105 hover:bg-primary-dark group-hover:shadow-primary/40'
                    }`}
                  >
                    {isRecording ? (
                      <div className="w-8 h-8 bg-white rounded-lg"></div>
                    ) : isTranscribing ? (
                      <svg className="w-10 h-10 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    )}
                  </button>
                  
                  <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] transition-opacity duration-300 ${isRecording || isTranscribing ? 'opacity-100' : 'opacity-0'}`}>
                    {isRecording ? 'Tap to finish' : 'Thinking...'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleEndInterview}
                  className="bg-accent hover:bg-accent-light text-white px-10 py-5 rounded-2xl font-heading font-black text-xl transition-all shadow-2xl hover:shadow-accent/40 active:scale-95 animate-bounce-subtle"
                >
                  View Final Evaluation
                </button>
              )}
              
              {!isRecording && !isTranscribing && stage !== 'end' && (
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest animate-pulse">
                  Click the mic and start explaining
                </p>
              )}
            </div>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
      `}} />
    </div>
  )
}
