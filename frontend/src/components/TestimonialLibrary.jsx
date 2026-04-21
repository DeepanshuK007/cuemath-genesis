import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { API_BASE } from '../services/api'

export default function TestimonialLibrary() {
  const [searchParams] = useSearchParams()
  const [testimonials, setTestimonials] = useState([])
  const [isSubscribed, setIsSubscribed] = useState(searchParams.get('subscribed') === 'true')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('subscribed') === 'true') {
      setShowSuccess(true)
      window.history.replaceState({}, '', '/testimonials')
      setTimeout(() => setShowSuccess(false), 5000)
    }

    // Mock testimonials data
    setTestimonials([
      {
        id: 1,
        tutorName: 'Tamanna Kothari',
        topic: 'Explaining fractions to a 9-year-old',
        rating: 4.8,
        views: '1,204',
        trending: true,
        image: '/images/tamanna.jpeg',
        preview: 'She used pizza examples perfectly...',
        fullTranscript: 'So imagine you have a pizza, and you share it with your friend...',
        cliffhanger: 'The exact phrase Tamanna used to make fractions click instantly...',
      },
      {
        id: 2,
        tutorName: 'Rahul Verma',
        topic: 'Teaching multiplication through real-life scenarios',
        rating: 4.6,
        views: '856',
        trending: false,
        image: '/images/rahul.jpeg',
        preview: 'His patience during the stress test was remarkable...',
        fullTranscript: 'Multiplication is like counting in groups...',
        cliffhanger: 'How Rahul kept his cool when the student said "I hate math"...',
      },
      {
        id: 3,
        tutorName: 'Ananya Patel',
        topic: 'Handling a frustrated student',
        rating: 4.9,
        views: '2,105',
        trending: true,
        image: '/images/ananya.jpeg',
        preview: 'The way she turned the situation around was impressive...',
        fullTranscript: 'It is okay to feel frustrated with math...',
        cliffhanger: 'The 3-step technique Ananya used to turn frustration into a "Wow" moment...',
      },
    ])
  }, [])

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to initiate checkout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Success Animation Banner */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-24 left-1/2 z-50"
          >
            <div className="bg-primary border-2 border-black text-black px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <div className="w-10 h-10 bg-black text-white border-2 border-black flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-black uppercase tracking-[0.2em] text-[11px]">Payment Successful! Library Unlocked.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto transition-transform group-hover:scale-105" />
              <div className="h-4 w-[1px] bg-gray-300"></div>
              <span className="text-[10px] font-black tracking-[0.3em] text-black uppercase">GENESIS</span>
            </Link>
          </div>

          {/* Centered User Badge */}
          <div className="flex justify-center">
            {isSubscribed && (
               <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-black px-4 h-9">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Premium Member</span>
                  <span className="text-[9px] font-black text-black uppercase tracking-widest italic">{localStorage.getItem('tutorName') || 'Tutor'}</span>
               </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Link 
              to="/" 
              className="text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest h-10 flex items-center"
            >
              Exit Library
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">Elite Resources</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-black mb-6">
            Learning Resources <span className="text-primary italic">Library.</span>
          </h1>
          <p className="text-gray-500 font-sans text-lg max-w-2xl mx-auto leading-relaxed">
            Learn from Cuemath's top-rated tutors. Watch how they explain concepts,
            handle challenges, and inspire young minds.
          </p>
        </div>
      </section>

      {/* Subscription Banner */}
      {!isSubscribed && (
        <section className="py-16 bg-cream">
          <div className="max-w-5xl mx-auto px-8">
            <div className="bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden">
               {/* Accent Gradient */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
               
               <div className="grid md:grid-cols-[1fr_350px] gap-12 items-center relative z-10">
                 <div>
                    <div className="inline-flex items-center gap-2 bg-accent text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest mb-6">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Limited Time Offer
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">
                      Pass Your Interview. <span className="italic underline decoration-primary decoration-4 underline-offset-4">Guaranteed.</span>
                    </h2>
                    <p className="text-gray-600 font-sans text-lg mb-8 leading-relaxed">
                      Tutors who study our Premium Library have an <span className="text-black font-black bg-primary/10 px-1">82% higher pass rate.</span> Don't leave your Cuemath career to chance.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "Full Interview Recordings",
                        "Feedback Reports & Scores",
                        "Flashcard Deck Access",
                        "Stress-Test Strategies"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-black uppercase tracking-tight">
                           <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                           </svg>
                           {item}
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="bg-gray-50 border-2 border-black p-8 flex flex-col items-center text-center">
                    <div className="mb-6 w-full">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                          <span>Capacity</span>
                          <span className="text-accent">14 Spots Left</span>
                       </div>
                       <div className="w-full h-2 bg-gray-200">
                          <div className="h-full bg-accent w-[86%]"></div>
                       </div>
                    </div>

                    <button
                      onClick={handleSubscribe}
                      disabled={isLoading}
                      className="w-full bg-black text-white py-5 font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'Processing...' : 'Unlock Premium Access'}
                    </button>
                    <p className="mt-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                       Secure Stripe Checkout • Instant Access
                    </p>
                 </div>
               </div>
            </div>
          </div>
        </section>
      )}      {/* Testimonials Grid */}
      <main className="max-w-6xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">The Gallery</span>
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-black uppercase tracking-tight">
             Featured <span className="text-primary italic">Tutorials</span>
           </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {testimonials.map((tutorial, i) => (
            <motion.div 
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(56,31,240,1)] transition-all duration-300 flex flex-col"
            >
              {/* Video Placeholder */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden border-b-2 border-black">
                <img
                  src={tutorial.image}
                  alt={tutorial.tutorName}
                  className={`w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ${
                    tutorial.tutorName === 'Ananya Patel' ? 'object-[50%_20%]' : 
                    tutorial.tutorName === 'Tamanna Kothari' ? 'object-[50%_35%]' : 
                    'object-center'
                  }`}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white border-2 border-black rounded-none flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer group-hover:bg-primary group-hover:text-white transition-all">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                  5:32
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1 bg-gray-50 border border-black px-2 py-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-xs font-black text-black uppercase">{tutorial.rating}</span>
                  </div>
                  {tutorial.trending && (
                    <div className="text-[10px] font-black text-white bg-accent px-2 py-1 uppercase tracking-widest animate-pulse">
                      Trending 🔥
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-serif font-bold text-black mb-1 uppercase">{tutorial.tutorName}</h3>
                <p className="text-xs text-gray-500 font-sans mb-6 leading-relaxed italic">"{tutorial.topic}"</p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {tutorial.views}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Flashcards
                  </div>
                </div>

                <div className="mt-auto">
                  {isSubscribed ? (
                    <button className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                      Watch Tutorial
                    </button>
                  ) : (
                    <div className="relative border-2 border-black group/reveal overflow-hidden">
                      <div className="p-6 bg-gray-50 blur-sm opacity-30 select-none">
                        <p className="text-[10px] leading-relaxed">
                          {tutorial.fullTranscript.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mb-4">
                          {tutorial.cliffhanger}
                        </p>
                        <button
                          onClick={handleSubscribe}
                          disabled={isLoading}
                          className="relative overflow-hidden bg-black text-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(255,107,74,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 min-w-[180px]"
                        >
                          <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
                            Unlock Content
                          </span>
                          {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                              <span className="text-[8px] mb-2 animate-pulse text-gray-400">Processing Payment...</span>
                              <div className="w-24 h-1.5 bg-gray-800 border border-gray-700 overflow-hidden mb-2">
                                <motion.div 
                                  initial={{ x: '-100%' }}
                                  animate={{ x: '0%' }}
                                  transition={{ duration: 1.5, ease: "easeInOut" }}
                                  className="w-full h-full bg-primary"
                                />
                              </div>
                              <span className="text-[7px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                                Do not refresh or go back
                              </span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {testimonials.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600 font-sans">
              Our learning library is being built. Check back soon!
            </p>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-8">
           <div className="bg-black text-white p-12 text-center shadow-[12px_12px_0px_0px_rgba(56,31,240,1)]">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">The Next Generation</span>
              <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                Want to be <span className="text-primary italic">Featured?</span>
              </h3>
              <p className="text-gray-400 font-sans text-lg mb-10 max-w-xl mx-auto">
                Ace your interview and your explanation could be here. Join our community of world-class educators today.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-10 py-5 font-black uppercase tracking-widest text-lg transition-all active:scale-95 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]"
              >
                Apply Now
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
           </div>
        </div>
      </section>
    </div>
  )
}
