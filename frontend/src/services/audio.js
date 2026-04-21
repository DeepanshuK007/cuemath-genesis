// Audio service using MediaRecorder + Whisper API for transcription
// Browser TTS for speech synthesis

class AudioService {
  constructor() {
    this.recognition = null
    this.lastTranscript = ''
    this.interimTranscript = ''
    this.synthesis = window.speechSynthesis
    this.isRecording = false
  }

  async startRecording(onDataAvailable) {
    try {
      this.lastTranscript = ''
      this.interimTranscript = ''
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported in this browser.')
        return false
      }

      this.recognition = new SpeechRecognition()
      this.recognition.continuous = true
      this.recognition.interimResults = true

      this.recognition.onresult = (event) => {
        let interim = ''
        let final = ''
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript
          } else {
            interim += event.results[i][0].transcript
          }
        }
        
        if (final) {
          this.lastTranscript += final + ' '
        }
        this.interimTranscript = interim
      }

      this.recognition.onend = () => {
        this.isRecording = false
      }

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }

      this.recognition.start()
      this.isRecording = true
      console.log('Recording started (Web Speech API)')
      return true

    } catch (error) {
      console.error('Failed to start recording:', error)
      return false
    }
  }

  async stopRecording() {
    return new Promise((resolve) => {
      if (this.recognition && this.isRecording) {
        this.recognition.stop()
        this.isRecording = false
        // Return dummy blob to satisfy frontend flow
        resolve(new Blob(['dummy'], { type: 'audio/webm' }))
      } else {
        resolve(null)
      }
    })
  }

  // Transcribe audio using gathered text from Web Speech API
  async transcribe(audioBlob) {
    try {
      // Small delay to allow any final onresult events to process
      await new Promise(resolve => setTimeout(resolve, 300))
      const text = (this.lastTranscript + ' ' + this.interimTranscript).trim()
      this.lastTranscript = ''
      this.interimTranscript = ''
      return text
    } catch (error) {
      console.error('Transcription error:', error)
      throw error
    }
  }

  speak(text, onEnd) {
    if (!this.synthesis) {
      console.warn('Speech synthesis not supported')
      if (onEnd) onEnd()
      return
    }

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1.1
    utterance.volume = 1

    // Try to get a friendly voice
    const voices = this.synthesis.getVoices()
    const childVoice = voices.find(v =>
      v.name.includes('Female') && v.lang.includes('en')
    ) || voices.find(v => v.lang.includes('en'))

    if (childVoice) {
      utterance.voice = childVoice
    }

    utterance.onend = () => {
      if (onEnd) onEnd()
    }

    this.synthesis.speak(utterance)
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }

  isRecordingActive() {
    return this.isRecording
  }

  isSpeechSupported() {
    return 'speechSynthesis' in window
  }
}

export const audioService = new AudioService()
