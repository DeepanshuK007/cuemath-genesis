import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogin } from '@react-oauth/google'

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
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      })

      if (response.ok) {
        const data = await response.json()
        signIn(data.user)
        navigate('/')
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
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-sans font-bold text-xl text-gray-800">Cuemath</span>
            <span className="font-sans text-sm text-primary font-medium ml-1">Genesis</span>
          </Link>
        </div>
      </header>

      {/* Sign In Form */}
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center mb-8 font-sans">
            Sign in to continue your tutor journey
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 font-sans text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                placeholder="priya@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-600 font-sans">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline font-sans">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white py-3 rounded-lg font-sans font-semibold transition"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6 font-sans text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Apply Now
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
