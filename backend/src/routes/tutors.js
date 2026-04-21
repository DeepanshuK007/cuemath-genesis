import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

// In-memory storage (use a real database in production)
const tutors = new Map()

// POST /api/tutors - Create new tutor
router.post('/', (req, res) => {
  const { name, email, phone, experience, subjects, motivation } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const id = uuidv4()
  const tutor = {
    id,
    name,
    email,
    phone,
    experience,
    subjects,
    motivation,
    createdAt: new Date().toISOString(),
    status: 'applied'
  }

  tutors.set(id, tutor)

  console.log(`📝 New tutor application: ${name} (${email})`)
  res.json({ id, name, email, message: 'Application submitted successfully' })
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
