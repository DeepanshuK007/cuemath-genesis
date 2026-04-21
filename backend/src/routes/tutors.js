import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
const router = Router()

// In-memory storage for development/demo purposes
const tutors = new Map()

// POST /api/tutors - Create new tutor
router.post('/', (req, res) => {
  const { name, email, phone, experience, subjects, motivation } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  // Check if email already exists in memory
  const existing = Array.from(tutors.values()).find(t => t.email === email)
  if (existing) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  const id = uuidv4()
  const createdAt = new Date().toISOString()
  const status = 'applied'

  const newTutor = {
    id,
    name,
    email,
    phone,
    experience,
    subjects,
    motivation,
    status,
    createdAt
  }

  tutors.set(id, newTutor)
  console.log(`📝 New tutor application (In-Memory): ${name} (${email})`)
  res.json({ id, name, email, message: 'Application submitted successfully (Demo Mode)' })
})

// GET /api/tutors/:id - Get tutor by ID
router.get('/:id', (req, res) => {
  const tutor = tutors.get(req.params.id)
  if (!tutor) {
    return res.status(404).json({ error: 'Tutor not found' })
  }
  res.json(tutor)
})

// GET /api/tutors - Get all tutors (admin)
router.get('/', (req, res) => {
  res.json(Array.from(tutors.values()))
})

export default router
