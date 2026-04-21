export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const api = {
  async signup(tutorData) {
    const response = await fetch(`${API_BASE}/tutors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tutorData),
    })
    return response.json()
  },

  async getTutor(id) {
    const response = await fetch(`${API_BASE}/tutors/${id}`)
    return response.json()
  },

  async startInterview(tutorId, topicId) {
    const response = await fetch(`${API_BASE}/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tutorId, topicId }),
    })
    return response.json()
  },

  async sendMessage(sessionId, audioData) {
    const response = await fetch(`${API_BASE}/interview/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, audioData }),
    })
    return response.json()
  },

  async endInterview(sessionId) {
    const response = await fetch(`${API_BASE}/interview/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    return response.json()
  },

  async getEvaluation(sessionId) {
    const response = await fetch(`${API_BASE}/interview/evaluation/${sessionId}`)
    return response.json()
  },

  async sendFeedback(sessionId, feedbackData) {
    const response = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, ...feedbackData }),
    })
    return response.json()
  },

  async generateFlashcards(transcript) {
    const response = await fetch(`${API_BASE}/flashcards/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    })
    return response.json()
  },

  async getTestimonials() {
    const response = await fetch(`${API_BASE}/testimonials`)
    return response.json()
  },
}
