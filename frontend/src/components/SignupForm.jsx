import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../services/api'

export default function SignupForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'beginner',
    subjects: [],
    motivation: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const subjects = ['Math', 'Science', 'English', 'Hindi', 'Other']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubjectToggle = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const result = await api.signup(formData)
      if (result.id) {
        // Store tutor ID for later use
        localStorage.setItem('tutorId', result.id)
        localStorage.setItem('tutorName', formData.name)
        navigate('/topic')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Failed to submit. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-sans font-bold text-xl text-gray-800">Cuemath</span>
            <span className="font-sans text-sm text-primary font-medium ml-1">Genesis</span>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
            Join Our Tutor Community
          </h1>
          <p className="text-gray-600 mb-8 font-sans">
            Tell us about yourself so we can get to know you better.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                placeholder="Priya Sharma"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                placeholder="priya@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Teaching Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans"
              >
                <option value="beginner">New to teaching</option>
                <option value="intermediate">1-3 years experience</option>
                <option value="expert">3+ years experience</option>
              </select>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Subjects You Can Teach
              </label>
              <div className="flex flex-wrap gap-2">
                {subjects.map(subject => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`px-4 py-2 rounded-full font-sans text-sm transition ${
                      formData.subjects.includes(subject)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div>
              <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                Why do you want to tutor? (Optional)
              </label>
              <textarea
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-sans resize-none"
                placeholder="Share what inspires you to teach..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white py-4 rounded-lg font-sans font-semibold text-lg transition"
            >
              {isSubmitting ? 'Submitting...' : 'Continue to Interview'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6 font-sans text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
