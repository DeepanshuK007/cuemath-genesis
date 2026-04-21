# Cuemath Genesis: Design & Implementation Notes

This document outlines the architectural decisions, trade-offs, and improvements made during the development and standardization of the Cuemath Genesis platform.

## 1. AI Strategy & Integration

### Decisions
- **Gemini-Only Core**: Standardized the entire platform on **Google Gemini 1.5 Flash**. This includes Chat, Evaluation, and Transcription.
- **Native Audio Processing**: Replaced OpenAI Whisper with Gemini's native audio capabilities in `transcription.js`.
- **System Prompting**: Implemented a "Persona-First" prompting strategy for **Alex**, the 10-year-old student, to ensure consistent character behavior during interviews.

### Trade-offs
- **Provider Lock-in**: Moving exclusively to Gemini simplifies the codebase but creates a dependency on a single provider.
- **Latency vs. Intelligence**: Using Gemini 1.5 Flash provides a balance of speed and reasoning, though models like 1.5 Pro offer deeper reasoning at higher cost/latency.

## 2. User Experience (UX) & Design

### Decisions
- **Two-Column Interview Layout**: Moved from a single-column scroll to a split-panel "Mission Control" layout. 
- **Glassmorphism Design System**: Adopted a modern, translucent aesthetic with subtle borders to give the app a premium, high-tech feel.
- **Math Notebook Backdrop**: Added a subtle 30px grid background to the `body` to reinforce the educational context of the brand.

### Improvements
- **Cognitive Load Reduction**: By keeping the "Topic Card" and "Session Progress" pinned to the left, candidates no longer need to scroll up to remember what they are teaching.
- **Visual Feedback**: Integrated state-aware indicators (Listening, Thinking, Speaking) with micro-animations to improve the "human" feel of the AI interaction.

## 3. Technical Architecture

### Decisions
- **Vite/React Frontend**: Leveraged Vite for ultra-fast HMR and build times.
- **Node.js/Express Backend**: Kept the backend lightweight and focused on secure API orchestration.
- **Removal of Database Logic**: Simplified the prototype by removing local database dependencies, focusing purely on the AI interaction and evaluation flow.

### Improvements
- **Clean Dependency Tree**: Purged `openai` and `groq` packages, reducing the build size and eliminating potential `MODULE_NOT_FOUND` errors in production.
- **Environment Standardization**: Centralized all AI configuration under a single `GEMINI_API_KEY`, simplifying deployment on Render and Vercel.

## 4. Evaluation & Feedback Loop

### Decisions
- **Multi-Dimensional Scoring**: Evaluation is based on five key tutoring pillars: Warmth, Clarity, Patience, Simplicity, and Fluency.
- **Automated Flashcards**: The system now generates educational flashcards *during* the interview based on the tutor's explanations, serving as a "proof of work" for the candidate.

### Improvements
- **Report Transparency**: The `EvaluationDashboard` now visualizes these scores with high-impact charts and highlights "Standout Moments" from the transcript.

---
**Status**: Production Ready
**AI Engine**: Google Gemini 1.5 Flash
**Design Tokens**: Outfit (Headings), Albert Sans (Body), Cuemath Purple (#381FF0)
