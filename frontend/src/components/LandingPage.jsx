import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user, isSignedIn, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/cuemath-logo.png" alt="Cuemath Logo" className="h-10 w-auto" />
            <span className="font-sans text-sm text-black font-bold ml-1 tracking-tight">GENESIS</span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link to="/testimonials" className="text-black hover:text-primary transition font-medium">
              Testimonials
            </Link>
            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-black">Hi, {user?.name || user?.email?.split('@')[0]}</span>
                <button
                  onClick={signOut}
                  className="text-black hover:text-primary transition font-sans text-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/signin" className="text-black hover:text-primary transition font-medium">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 bg-cream">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/30 to-cream"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-black mb-6 drop-shadow-md">
            Become a<br />
            <span className="text-primary">Cuemath Tutor</span>
          </h1>
          <p className="text-xl md:text-2xl text-dark max-w-2xl mx-auto mb-10 font-sans font-medium drop-shadow-sm">
            Teach math, inspire minds. <br className="hidden md:block" />
            Join our elite tutor community in minutes.
          </p>
          <Link
            to={isSignedIn ? "/topic" : "/signup"}
            className="group relative overflow-hidden inline-flex items-center gap-2 bg-primary text-black px-10 py-5 rounded-none font-sans font-bold text-xl transition-all duration-500 shadow-xl hover:shadow-2xl"
          >
            {/* Door animation panels */}
            <span className="absolute inset-y-0 left-0 w-1/2 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
            <span className="absolute inset-y-0 right-0 w-1/2 bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
            
            {/* Button Content */}
            <span className="relative z-10 flex items-center gap-2 group-hover:text-primary transition-colors duration-500">
              {isSignedIn ? "Continue Your Journey" : "Start Your Journey"}
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-black mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-sans font-semibold text-black mb-3">
                Apply Online
              </h3>
              <p className="text-dark font-sans">
                Fill out a simple form with your details and experience.
                Takes just 2 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-sans font-semibold text-black mb-3">
                AI Interview
              </h3>
              <p className="text-dark font-sans">
                Have a friendly voice conversation with our AI.
                Show us your teaching style.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-sans font-semibold text-black mb-3">
                Start Teaching
              </h3>
              <p className="text-dark font-sans">
                Get detailed feedback and join our community of
                exceptional tutors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-black mb-4">
            What We're Looking For
          </h2>
          <p className="text-center text-dark max-w-2xl mx-auto mb-16 font-sans">
            It's not just about knowing math — it's about how you teach it.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Warmth', desc: 'Do you make students feel supported and encouraged?' },
              { title: 'Clarity', desc: 'Can you explain complex ideas in simple ways?' },
              { title: 'Patience', desc: 'Do you stay calm when students struggle?' },
              { title: 'Simplicity', desc: 'Do you avoid jargon and use relatable examples?' },
              { title: 'Fluency', desc: 'Can you communicate clearly in English?' },
              { title: 'Passion', desc: 'Do you genuinely love helping students learn?' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <h3 className="text-lg font-sans font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-dark font-sans text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isSignedIn && (
        <section className="bg-primary py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-serif font-bold text-white mb-6">
              Ready to Make Math Fun?
            </h2>
            <p className="text-white/80 text-lg mb-10 font-sans">
              Join hundreds of tutors who are already inspiring young minds.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-orange-500 text-white px-8 py-4 rounded-full font-sans font-semibold text-lg transition shadow-lg"
            >
              Apply Now
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold">Cuemath Genesis</span>
          </div>
          <p className="text-gray-400 font-sans text-sm">
            Scaling great math education through AI-powered hiring.
          </p>
        </div>
      </footer>
    </div>
  )
}
