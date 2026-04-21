import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { user, isSignedIn, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/cuemath-logo-v2.png" alt="Cuemath Logo" className="h-10 w-auto" />
            <span className="font-sans text-[10px] text-black font-bold ml-1 tracking-tight">GENESIS</span>
            {isSignedIn && (
              <div className="ml-4 px-3 py-1.5 border border-black bg-gray-50 rounded-none">
                <span className="text-xs text-black font-bold uppercase tracking-wide">Hi, {user?.name || user?.email?.split('@')[0]}</span>
              </div>
            )}
          </div>
          <nav className="flex gap-4 items-center">
            <Link to="/testimonials" className="text-black border-2 border-black hover:bg-black hover:text-white px-4 py-2 rounded-none transition-all duration-300 font-athletics font-bold uppercase text-xs tracking-widest">
              Testimonials
            </Link>
            {isSignedIn ? (
              <button
                onClick={signOut}
                className="text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-none transition-all duration-300 font-sans font-bold uppercase text-xs tracking-widest"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/signin" className="text-white bg-black hover:bg-gray-800 px-4 py-2 rounded-none transition-all duration-300 font-athletics font-bold uppercase text-xs tracking-widest">
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
          preload="auto"
          poster="/hero-poster.png"
          className="absolute inset-0 w-full h-full object-cover opacity-90 transition-opacity duration-1000"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cream/30 to-cream"></div>
        
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <h1 className="text-4xl md:text-6xl font-athletics font-black text-black mb-6 drop-shadow-md tracking-tighter uppercase leading-[0.9]">
            Become a<br />
            <span className="text-primary">Cuemath Tutor</span>
          </h1>
          <p className="text-xl md:text-3xl text-dark/80 max-w-3xl mx-auto mb-12 font-sans font-bold drop-shadow-sm tracking-tight animate-fade-in-up">
            Transform lives. Teach math. <span className="text-primary">Join the elite.</span>
          </p>
          <Link
            to={isSignedIn ? "/topic" : "/signup"}
            className="group relative overflow-hidden inline-flex items-center gap-2 bg-primary text-black px-10 py-5 rounded-none font-untitled font-semibold text-xl transition-all duration-500 shadow-xl hover:shadow-2xl"
          >
            {/* Door animation panels */}
            <span className="absolute inset-y-0 left-0 w-[51%] bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
            <span className="absolute inset-y-0 right-0 w-[51%] bg-black translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></span>
            
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
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">The Journey</span>
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-black">
               How to become a <span className="text-primary italic">Cuemath Elite.</span>
             </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Apply Online",
                desc: "Share your experience and teaching passion in a quick 2-minute form.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                step: "02",
                title: "AI Interview",
                desc: "Meet Alex, our AI student. Show your patience and clarity in a live voice session.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )
              },
              {
                step: "03",
                title: "Start Teaching",
                desc: "Get deep pedagogical feedback and join our community of world-class educators.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              }
            ].map((item, i) => (
              <div key={item.step} className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                        {item.icon}
                     </div>
                     <span className="text-4xl font-black text-gray-200 group-hover:text-primary/20 transition-colors">
                        {item.step}
                     </span>
                  </div>
                  <h3 className="text-xl font-sans font-bold text-black mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-sans text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
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
      <footer className="py-20 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3 grayscale opacity-50">
              <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto" />
              <div className="h-4 w-[1px] bg-gray-300"></div>
              <span className="font-sans font-black text-[10px] tracking-widest text-slate uppercase">Genesis</span>
            </div>
            <p className="text-gray-400 font-sans text-xs uppercase tracking-[0.2em] font-bold">
              © 2026 Cuemath • Scaling Excellence
            </p>
            <p className="text-[10px] font-black text-primary/80 uppercase tracking-[0.3em] mt-2">
              Built by Deepanshu
            </p>
          </div>

          <div className="text-center md:text-right max-w-sm">
            <p className="text-gray-500 font-sans text-sm font-medium leading-relaxed">
              Empowering the world's best educators through high-fidelity AI simulations.
            </p>
          </div>
        </div>
      </footer>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  )
}
