import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { API_BASE } from '../services/api'
import { motion } from 'framer-motion'

export default function SignIn() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (email && password) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      signIn({ email, name: email.split('@')[0] })
      navigate('/')
    } else {
      setError('Please enter email and password')
    }
    setIsLoading(false)
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      })

      if (response.ok) {
        const data = await response.json()
        signIn(data.user)
        navigate('/topic')
      } else {
        setError('Google sign-in failed. Please try again.')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    }

    setIsLoading(false)
  }

  const handleGoogleError = () => {
    setError('Google sign-in was unsuccessful. Please try again.')
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-primary selection:text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </Link>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto transition-transform group-hover:scale-105" />
              <div className="h-4 w-[1px] bg-gray-300"></div>
              <span className="text-[10px] font-black tracking-[0.3em] text-black uppercase">GENESIS</span>
            </Link>
          </div>
          <Link to="/signup" className="text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest h-10 flex items-center">
            Apply Now
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border-2 border-black p-10 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
        >
          {/* Decorative Corner */}
          <div className="absolute -top-1 -left-1 w-4 h-4 bg-primary border-r-2 border-b-2 border-black"></div>

          <div className="text-center mb-10">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] block mb-3">Tutor Access</span>
            <h1 className="text-4xl font-serif font-bold text-black mb-2 uppercase tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-xs font-sans uppercase tracking-widest">
              Continue your journey
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-black text-red-600 px-4 py-3 mb-8 font-black text-[10px] uppercase tracking-widest text-center animate-shake">
              {error}
            </div>
          )}

          {/* Google Sign In Section */}
          <div className="mb-8 border-2 border-black p-1 hover:bg-gray-50 transition-colors">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="px-4 bg-white text-gray-400 font-black uppercase tracking-widest italic">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans"
                placeholder="priya@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 border-2 border-black rounded-none text-primary focus:ring-0" />
                <span className="ml-2 text-gray-500 group-hover:text-black transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-5 font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 disabled:bg-gray-400 relative overflow-hidden"
            >
              {isLoading ? (
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <span className="animate-pulse">Authenticating</span>
                  <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-[1500ms] ease-out" style={{ width: isLoading ? '100%' : '0%' }}></div>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Bottom Link */}
          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline underline-offset-4 ml-1">
                Apply Now
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
