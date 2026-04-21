# Cuemath Genesis - AI Tutor Screener

An AI-powered tutor screening platform that conducts voice interviews, assesses soft skills, and generates personalized feedback.

## Features

- **Landing Page** - Professional welcome page with Cuemath branding
- **Signup Form** - Collects tutor details (name, email, phone, experience, subjects)
- **Random Topic Assignment** - Assigns tutoring scenarios from a bank of 10 topics
- **AI Interview Room** - Voice conversation with "Alex" (a 10-year-old AI persona)
  - Real-time speech recognition
  - Mock TTS for AI responses
  - Stress test (frustrated student)
  - Jargon detection
- **Evaluation Dashboard** - 5-dimension scoring (Warmth, Clarity, Patience, Simplicity, Fluency)
- **Flashcard Generation** - Creates flashcards from tutor's explanations
- **Tutor Feedback Report** - Detailed analysis with improvement suggestions
- **Testimonial Library** - Featured tutorials (subscription-based, demo mode)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js
- **Voice**: Browser Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Design**: Cuemath brand colors (Primary: #381FF0, Accent: #FF6B4A)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running Locally

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## Project Structure

```
cuemath-genesis/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── TopicAssignment.jsx
│   │   │   ├── InterviewRoom.jsx
│   │   │   ├── EvaluationDashboard.jsx
│   │   │   └── TestimonialLibrary.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── audio.js
│   │   ├── data/
│   │   │   └── topics.js
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── tutors.js
│   │   │   ├── interview.js
│   │   │   ├── flashcards.js
│   │   │   ├── feedback.js
│   │   │   └── testimonials.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Interview Flow

1. Tutor fills signup form
2. System assigns random tutoring topic
3. Tutor enters AI interview room
4. "Alex" (AI child persona) guides the conversation
5. Stress test: "I don't get it, this is too hard!"
6. Jargon check: "What does that big word mean?"
7. Evaluation dashboard shows scores and feedback

## Future Enhancements

- [ ] Real AI integration (Claude API for conversation)
- [ ] Whisper API for accurate transcription
- [ ] Cartesia AI for natural TTS
- [ ] Real email delivery for feedback reports
- [ ] Stripe integration for subscriptions
- [ ] Video recording and storage
- [ ] Webcam emotion detection (smile/frown tracking)

## License

MIT
