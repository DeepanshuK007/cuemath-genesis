import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './components/LandingPage'
import SignIn from './components/SignIn'
import SignupForm from './components/SignupForm'
import TopicAssignment from './components/TopicAssignment'
import InterviewRoom from './components/InterviewRoom'
import EvaluationDashboard from './components/EvaluationDashboard'
import TestimonialLibrary from './components/TestimonialLibrary'
import CheckoutSuccess from './components/CheckoutSuccess'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '692828442395-4embqppllbjrhgtuhuktmrjmdau32f3q.apps.googleusercontent.com'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-cream">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/topic" element={<TopicAssignment />} />
              <Route path="/interview" element={<InterviewRoom />} />
              <Route path="/evaluation" element={<EvaluationDashboard />} />
              <Route path="/testimonials" element={<TestimonialLibrary />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
