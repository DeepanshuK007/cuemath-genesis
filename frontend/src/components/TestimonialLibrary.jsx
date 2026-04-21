import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
        cliffhanger: 'The exact phrase Priya used to make fractions click instantly...',
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
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-[bounce_1s_ease-in-out]">
          <div className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <span className="font-sans font-bold text-lg">Payment Successful! Library Unlocked.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/cuemath-logo-v2.png" alt="Cuemath Logo" className="h-10 w-auto" />
            <span className="font-sans text-[10px] text-black font-bold ml-1 tracking-tight">GENESIS</span>
          </Link>
          <Link to="/" className="text-gray-600 hover:text-primary font-sans text-sm">
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            Learning Resources Library
          </h1>
          <p className="text-xl text-white/80 font-sans max-w-2xl mx-auto">
            Learn from Cuemath's top-rated tutors. Watch how they explain concepts,
            handle challenges, and inspire young minds.
          </p>
        </div>
      </section>

      {/* Subscription Banner */}
      {!isSubscribed && (
        <section className="bg-accent py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 rounded-full bg-black opacity-10"></div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="flex-1">
                <div className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                  Limited Time Offer
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">
                  Pass Your Interview. Guaranteed.
                </h3>
                <p className="text-white/90 font-sans text-lg mb-4">
                  Tutors who study our Premium Library have an <strong className="text-white text-xl">82% higher pass rate</strong>. Don't leave your Cuemath career to chance.
                </p>
                <ul className="text-white/80 text-sm font-sans space-y-2 mb-2">
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Full Uncensored Interview Recordings</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Exact Feedback Reports & Scores</li>
                  <li className="flex items-center gap-2"><svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Downloadable Flashcard Decks</li>
                </ul>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="bg-white text-accent hover:bg-gray-50 px-8 py-4 rounded-full font-sans font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 whitespace-nowrap mb-3 w-full disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isLoading ? 'Loading...' : 'Unlock Premium Access'}
                </button>
                <span className="text-white/70 text-xs font-sans text-center">Only 14 spots left for this month</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">
          Featured Tutorials
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(tutorial => (
            <div key={tutorial.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              {/* Video Placeholder */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={tutorial.image}
                  alt={tutorial.tutorName}
                  className={`w-full h-full object-cover ${
                    tutorial.tutorName === 'Ananya Patel' ? 'object-[50%_20%]' : 
                    tutorial.tutorName === 'Tamanna Kothari' ? 'object-[50%_35%]' : 
                    'object-center'
                  }`}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition">
                    <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs font-sans px-2 py-1 rounded">
                  5:32
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(tutorial.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm font-sans font-medium text-gray-600 ml-1">{tutorial.rating}</span>
                  </div>
                  {tutorial.trending && (
                    <div className="flex items-center gap-1 text-xs font-bold text-accent bg-orange-50 px-2 py-1 rounded">
                      <span>🔥</span> Trending
                    </div>
                  )}
                </div>

                <h3 className="font-sans font-semibold text-gray-900 mb-1">{tutorial.tutorName}</h3>
                <p className="text-sm text-gray-600 font-sans mb-3">{tutorial.topic}</p>
                
                <div className="flex items-center gap-3 mb-4 text-xs font-sans text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    {tutorial.views} views
                  </span>
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Includes Flashcards
                  </span>
                </div>

                {isSubscribed ? (
                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-sans font-medium text-sm transition">
                    Watch Tutorial
                  </button>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                    <div className="p-4 bg-gray-50 filter blur-[3px] transition group-hover:blur-[2px] opacity-60">
                      <p className="text-sm text-gray-400 font-sans line-clamp-3 select-none">
                        "Here is exactly what I said to the student when they got confused... {tutorial.fullTranscript}"
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col items-center justify-end pb-4 px-4 text-center">
                      <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-black transition disabled:opacity-70 mx-auto mb-3"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                        {isLoading ? 'Loading...' : 'Unlock to Reveal'}
                      </button>
                      <p className="text-sm font-sans font-bold text-gray-800 drop-shadow-md px-2 text-center w-full">
                        {tutorial.cliffhanger}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Want to Be Featured?
          </h3>
          <p className="text-gray-600 font-sans mb-6">
            Ace your interview and your explanation could be here.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-sans font-semibold transition"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  )
}
