import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // In a real app, we would verify the session ID with the backend here
    // and unlock the user's access in the database.
  }, [sessionId])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 font-sans mb-8">
          Welcome to the Premium Learning Library. You now have full access to all uncensored tutorials, flashcard decks, and feedback reports.
        </p>
        <Link 
          to="/testimonials?subscribed=true"
          className="block w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-full font-sans font-bold text-lg transition shadow-md hover:shadow-lg"
        >
          Go to Premium Library
        </Link>
      </div>
    </div>
  )
}
