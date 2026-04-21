import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // In a real app, we would verify the session ID with the backend
  }, [sessionId])

  return (
    <div className="min-h-screen bg-cream selection:bg-primary selection:text-white flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto transition-transform group-hover:scale-105" />
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="text-[10px] font-black tracking-[0.4em] text-black uppercase">GENESIS</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white border-2 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-10 -rotate-45 translate-x-12 -translate-y-12"></div>
          
          <div className="text-center relative z-10">
            <div className="w-24 h-24 bg-green-400 border-2 border-black flex items-center justify-center mx-auto mb-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] block mb-4">Transaction Confirmed</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-8 leading-tight">
              Payment Successful!
            </h2>
            
            <p className="text-gray-500 font-sans text-lg mb-12 leading-relaxed">
              Welcome to the <span className="text-black font-black">Premium Learning Library</span>. You now have full access to all uncensored tutorials, flashcard decks, and feedback reports.
            </p>

            <Link 
              to="/testimonials?subscribed=true"
              className="block w-full bg-black text-white py-6 font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
            >
              Go to Premium Library
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
