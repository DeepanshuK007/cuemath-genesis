import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function SignupForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'beginner',
    subjects: ['Math'],
    reason: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const subjects = ['Math', 'Science', 'English', 'Hindi', 'Other']

  const toggleSubject = (sub) => {
    if (formData.subjects.includes(sub)) {
      setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== sub) })
    } else {
      setFormData({ ...formData, subjects: [...formData.subjects, sub] })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    localStorage.setItem('tutorName', formData.name)
    localStorage.setItem('tutorId', 'mock-id-' + Math.random())
    navigate('/topic')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream selection:bg-primary selection:text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l-7-7m7 7h18" />
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
          <Link to="/signin" className="text-black border border-black px-6 py-2 hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest h-10 flex items-center">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 flex items-center justify-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white border-2 border-black p-10 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-l-2 border-b-2 border-black"></div>

          <div className="text-center mb-10">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] block mb-3">Tutor Community</span>
            <h1 className="text-4xl font-serif font-bold text-black mb-2 uppercase tracking-tight">
              Join Our <span className="text-primary italic">Community</span>
            </h1>
            <p className="text-gray-400 text-xs font-sans uppercase tracking-widest">
              Tell us about yourself so we can get to know you better.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans text-sm"
                  placeholder="Tamanna Kothari"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans text-sm"
                  placeholder="priya@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Teaching Experience
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans text-sm appearance-none cursor-pointer"
                >
                  <option value="beginner">New to teaching</option>
                  <option value="intermediate">1-3 years experience</option>
                  <option value="expert">3+ years experience</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                Subjects You Can Teach
              </label>
              <div className="flex flex-wrap gap-3">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => toggleSubject(subject)}
                    className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black transition-all ${
                      formData.subjects.includes(subject) 
                      ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white text-black hover:bg-gray-50'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Why do you want to tutor? (Optional)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-black rounded-none focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(56,31,240,1)] transition-all outline-none font-sans text-sm h-32 resize-none"
                placeholder="Share what inspires you to teach..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-5 font-black uppercase tracking-widest text-lg shadow-[8px_8px_0px_0px_rgba(56,31,240,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95 disabled:bg-gray-400"
            >
              {isLoading ? 'Wait...' : 'Continue to Interview'}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline underline-offset-4 ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
