import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, isSignedIn, signOut } = useAuth()
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5
    }
  }, [])

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-primary selection:text-white">
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
            {isSignedIn && (
               <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-black px-4 h-9">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Signed In As</span>
                  <span className="text-[9px] font-black text-black uppercase tracking-widest">{user?.name || user?.email?.split('@')[0]}</span>
               </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex items-center justify-end gap-4">
            <Link to="/testimonials" className="border border-black px-6 py-2 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest h-10 flex items-center">
              Library
            </Link>
            {isSignedIn ? (
              <button
                onClick={signOut}
                className="text-white bg-black hover:bg-gray-800 border border-black px-6 py-2 transition-all duration-300 font-sans font-bold uppercase text-[10px] tracking-widest h-10 flex items-center"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/signin" className="text-white bg-black hover:bg-gray-800 border border-black px-6 py-2 transition-all duration-300 font-sans font-bold uppercase text-[10px] tracking-widest h-10 flex items-center">
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-poster.png"
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[0.2]"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-cream z-10"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-20 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block text-[10px] font-black text-black uppercase tracking-[0.5em] mb-6 bg-yellow-400 px-4 py-2">
              Teaching DNA Simulation
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-black leading-tight mb-8">
              Become a <br />
              <span className="text-primary italic underline decoration-black decoration-[6px] underline-offset-[12px]">Cuemath Tutor.</span>
            </h1>
            <p className="text-xl md:text-2xl font-sans text-gray-800 mb-12 max-w-xl leading-relaxed">
              Transform lives. Teach math. Join the elite network of educators shaping the next generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to={isSignedIn ? "/topic" : "/signup"}
                className="bg-black text-white px-10 py-6 font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
              >
                {isSignedIn ? "Continue Your Journey" : "Apply Now"}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Journey */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-32 bg-white relative overflow-hidden"
      >
        {/* Background Decorative Art */}
        <div className="absolute top-0 right-0 w-1/3 opacity-5 pointer-events-none translate-x-1/4">
           <img src="/math-art.png" alt="" className="w-full h-auto" />
        </div>
        <div className="absolute bottom-0 left-0 w-1/4 opacity-10 pointer-events-none -translate-x-1/4 translate-y-1/4">
           <img src="/tutor-art.png" alt="" className="w-full h-auto rotate-12" />
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
             <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">The Process</span>
             <h2 className="text-4xl md:text-6xl font-serif font-bold text-black">
               How to become a <span className="text-primary italic">Cuemath Elite.</span>
             </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              {
                step: "01",
                title: "Apply Online",
                desc: "Share your experience and teaching passion in a quick 2-minute form.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              },
              {
                step: "02",
                title: "AI Interview",
                desc: "Meet Alex, our AI student. Show your patience and clarity in a live voice session.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              },
              {
                step: "03",
                title: "Start Teaching",
                desc: "Get deep pedagogical feedback and join our community of world-class educators.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              }
            ].map((item, i) => (
              <motion.div 
                key={item.step} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="group relative z-10"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-none blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                <div className="relative bg-white rounded-none border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(56,31,240,1)] group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-8">
                     <div className="w-14 h-14 bg-black rounded-none flex items-center justify-center text-white group-hover:bg-primary transition-colors duration-500">
                        {item.icon}
                     </div>
                     <span className="text-5xl font-black text-gray-100 group-hover:text-primary/20 transition-colors">
                        {item.step}
                     </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-black mb-4 uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-sans text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* What We Look For */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={revealVariants}
        className="py-32 bg-cream relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-[0.03] pointer-events-none">
           <img src="/math-art.png" alt="" className="w-full scale-150" />
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] block mb-4">The Teaching DNA</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-black mb-6">
              What we're <span className="text-primary italic underline decoration-black decoration-4">looking for.</span>
            </h2>
            <p className="text-gray-500 font-sans text-xl max-w-2xl mx-auto leading-relaxed mb-6">
              It's not just about knowing math—it's about the <span className="text-black font-black italic">art of teaching it.</span>
            </p>
            {/* Mobile Hint */}
            <div className="md:hidden">
               <div className="inline-block border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                 <p className="text-[10px] font-black text-black uppercase tracking-widest">
                   Touch cards for immersive experience
                 </p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { title: "Warmth", desc: "Do you make students feel supported and encouraged?", icon: "❤️" },
              { title: "Clarity", desc: "Can you explain complex ideas in simple ways?", icon: "💎" },
              { title: "Patience", desc: "Do you stay calm when students struggle?", icon: "🧘" },
              { title: "Simplicity", desc: "Do you avoid jargon and use relatable examples?", icon: "🧩" },
              { title: "Fluency", desc: "Can you communicate clearly and confidently?", icon: "🗣️" },
              { title: "Passion", desc: "Do you genuinely love helping students grow?", icon: "🔥" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border-2 border-black p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(255,107,74,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif font-bold text-black mb-4 uppercase tracking-tighter">{item.title}</h3>
                <p className="text-gray-500 font-sans text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      {!isSignedIn && (
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white py-32 relative overflow-hidden"
        >
          {/* Background Decorative Art */}
          <div className="absolute top-0 right-0 w-1/4 opacity-5 pointer-events-none translate-x-1/4">
             <img src="/math-art.png" alt="" className="w-full h-auto" />
          </div>

          <div className="max-w-4xl mx-auto px-8 relative z-10">
            <div className="bg-black text-white p-12 md:p-16 text-center shadow-[12px_12px_0px_0px_rgba(56,31,240,1)] relative overflow-hidden group">
              {/* Internal Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] block mb-6">Join the Elite</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                Ready to Make <br />
                <span className="text-primary italic underline decoration-white decoration-4 underline-offset-8">Math Fun?</span>
              </h2>
              <p className="text-gray-400 font-sans text-lg mb-12 max-w-xl mx-auto leading-relaxed">
                Join hundreds of tutors who are already inspiring young minds and earning through their passion.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-4 bg-white text-black px-10 py-5 font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_rgba(255,107,74,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
              >
                Apply Now
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-20 px-8 border-t border-gray-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-end">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <img src="/cuemath-logo-v2.png" alt="Cuemath" className="h-8 w-auto brightness-0 invert" />
               <div className="h-5 w-[1px] bg-gray-700"></div>
               <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">GENESIS</span>
            </div>
            <p className="text-gray-500 font-sans max-w-md leading-relaxed mb-8">
              Empowering the world's best educators through high-fidelity AI simulations. We believe teaching is an art form.
            </p>
            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-primary bg-primary/10 inline-block px-4 py-2 border border-primary/20 mb-8 md:mb-0">
              © 2026 Cuemath • Scaling Excellence
            </div>
          </div>

          <div className="text-center md:text-right">
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
