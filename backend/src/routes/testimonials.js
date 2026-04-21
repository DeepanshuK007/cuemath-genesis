import { Router } from 'express'

const router = Router()

// Mock testimonials data
const testimonials = [
  {
    id: '1',
    tutorName: 'Tamanna Kothari',
    topic: 'Explaining fractions to a 9-year-old',
    rating: 4.8,
    duration: '5:32',
    views: 1247,
    isPremium: true,
    transcript: 'So imagine you have a pizza, and you want to share it with your friend...'
  },
  {
    id: '2',
    tutorName: 'Rahul Verma',
    topic: 'Teaching multiplication through real-life scenarios',
    rating: 4.6,
    duration: '6:15',
    views: 892,
    isPremium: true,
    transcript: 'Multiplication is like counting in groups. If you have 3 bags with 4 apples each...'
  },
  {
    id: '3',
    tutorName: 'Ananya Patel',
    topic: 'Handling a frustrated student',
    rating: 4.9,
    duration: '4:48',
    views: 2103,
    isPremium: false,
    transcript: 'It is completely okay to feel frustrated with math. Let me tell you a secret...'
  }
]

// GET /api/testimonials - Get all testimonials
router.get('/', (req, res) => {
  const { premium } = req.query

  let result = testimonials
  if (premium === 'true') {
    result = testimonials.filter(t => t.isPremium)
  } else if (premium === 'false') {
    result = testimonials.filter(t => !t.isPremium)
  }

  res.json({
    testimonials: result,
    total: result.length
  })
})

// GET /api/testimonials/:id - Get single testimonial
router.get('/:id', (req, res) => {
  const testimonial = testimonials.find(t => t.id === req.params.id)

  if (!testimonial) {
    return res.status(404).json({ error: 'Testimonial not found' })
  }

  res.json(testimonial)
})

// POST /api/testimonials - Create testimonial (admin only in production)
router.post('/', (req, res) => {
  const { tutorName, topic, rating, transcript, duration } = req.body

  if (!tutorName || !topic) {
    return res.status(400).json({ error: 'Tutor name and topic are required' })
  }

  const newTestimonial = {
    id: Date.now().toString(),
    tutorName,
    topic,
    rating: rating || 4.0,
    duration: duration || '5:00',
    views: 0,
    isPremium: true,
    transcript: transcript || '',
    createdAt: new Date().toISOString()
  }

  testimonials.push(newTestimonial)

  res.json({
    success: true,
    testimonial: newTestimonial
  })
})

export default router
