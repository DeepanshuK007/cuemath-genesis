  return (
    <div className="min-h-screen bg-cream font-sans text-slate overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-8 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-8 w-auto" />
            <div className="h-4 w-[1px] bg-gray-300 mx-1"></div>
            <span className="font-heading font-black text-[12px] tracking-widest text-primary uppercase">Genesis</span>
          </div>
          <nav className="flex gap-8 items-center">
            <Link to="/testimonials" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
              Testimonials
            </Link>
            {isSignedIn ? (
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-slate">Hi, {user?.name || user?.email?.split('@')[0]}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-slate text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/signin" className="px-6 py-2 border-2 border-slate text-slate rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate hover:text-white transition-all">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate via-slate/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate/60 via-transparent to-slate/60"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 animate-fade-in">
          <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm rounded-full text-primary-light text-[10px] font-black uppercase tracking-widest mb-8 border border-primary/30">
             Elite Tutor Program 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]">
            Become a<br />
            <span className="text-primary italic">Cuemath Tutor.</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Join the world's most elite math education platform. 
            Apply in minutes and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to={isSignedIn ? "/topic" : "/signup"}
              className="group relative px-10 py-5 bg-primary text-white rounded-2xl font-heading font-black text-xl uppercase tracking-tight transition-all hover:scale-105 hover:bg-primary-dark shadow-2xl shadow-primary/40 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSignedIn ? "Continue Application" : "Start Your Application"}
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
            <Link to="/testimonials" className="text-white/60 hover:text-white text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
               Watch Tutor Stories
               <div className="w-8 h-[1px] bg-white/20"></div>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="w-[1px] h-12 bg-white"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
             <div className="max-w-2xl">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block mb-4">The Cuemath Advantage</span>
                <h2 className="text-4xl md:text-6xl font-heading font-black text-slate leading-tight">
                  What we look for in our <span className="text-gray-300">Elite Tutors.</span>
                </h2>
             </div>
             <p className="text-gray-500 font-medium max-w-sm">
                Our selection process is rigorous, focusing on the human elements that make a great educator.
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Warmth', desc: 'Making every student feel safe and supported.', icon: '♥' },
              { title: 'Clarity', desc: 'Explaining the "Why" behind every "What".', icon: '✦' },
              { title: 'Patience', desc: 'Staying calm in the face of confusion.', icon: '☯' },
              { title: 'Simplicity', desc: 'Using kid-friendly analogies for big ideas.', icon: '◎' },
              { title: 'Fluency', desc: 'Clear, professional English communication.', icon: '✎' },
              { title: 'Passion', desc: 'A genuine love for teaching mathematics.', icon: '☀' },
            ].map((item, i) => (
              <div key={item.title} className="group bg-cream rounded-[32px] p-10 transition-all hover:bg-white hover:shadow-2xl hover:shadow-primary/5 border border-transparent hover:border-gray-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl mb-8 shadow-sm group-hover:scale-110 transition-transform">
                   {item.icon}
                </div>
                <h3 className="text-xl font-heading font-black text-slate mb-4 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isSignedIn && (
        <section className="py-20 px-8">
           <div className="max-w-7xl mx-auto bg-primary rounded-[48px] p-12 md:p-24 relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
              
              <h2 className="text-4xl md:text-7xl font-heading font-black text-white mb-10 leading-tight relative z-10">
                Ready to inspire the<br />next generation?
              </h2>
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 bg-white text-primary px-12 py-6 rounded-3xl font-heading font-black text-xl uppercase tracking-tight transition-all hover:scale-105 hover:bg-cream shadow-2xl relative z-10"
              >
                Join the Mission
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
           </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-40">
            <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-6 w-auto" />
            <span className="font-heading font-black text-[10px] tracking-widest text-slate uppercase">Genesis</span>
          </div>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            © 2026 Cuemath Genesis • Scaling Excellence
          </p>
          <div className="flex gap-6">
             <a href="#" className="text-[10px] font-black text-gray-300 hover:text-primary uppercase tracking-widest transition-colors">Privacy</a>
             <a href="#" className="text-[10px] font-black text-gray-300 hover:text-primary uppercase tracking-widest transition-colors">Terms</a>
          </div>
        </div>
      </footer>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  )
