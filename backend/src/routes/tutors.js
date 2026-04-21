import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import db from '../db.js'

const router = Router()

// Database storage (SQLite)

// POST /api/tutors - Create new tutor
router.post('/', (req, res) => {
  const { name, email, phone, experience, subjects, motivation } = req.body

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const id = uuidv4()
  const createdAt = new Date().toISOString()
  const status = 'applied'
  const subjectsStr = JSON.stringify(subjects)

  db.run(
    `INSERT INTO tutors (id, name, email, phone, experience, subjects, motivation, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, email, phone, experience, subjectsStr, motivation, status, createdAt],
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' })
        }
        console.error('Error inserting tutor:', err)
        return res.status(500).json({ error: 'Database error' })
      }
      console.log(`📝 New tutor application: ${name} (${email})`)
      res.json({ id, name, email, message: 'Application submitted successfully' })
    }
  )
})

// GET /api/tutors/:id - Get tutor by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM tutors WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      console.error('Error fetching tutor:', err)
      return res.status(500).json({ error: 'Database error' })
    }
    if (!row) {
      return res.status(404).json({ error: 'Tutor not found' })
    }
    if (row.subjects) {
      try { row.subjects = JSON.parse(row.subjects) } catch (e) {}
    }
    res.json(row)
  })
})

// GET /api/tutors - Get all tutors (admin)
router.get('/', (req, res) => {
  db.all('SELECT * FROM tutors', [], (err, rows) => {
    if (err) {
      console.error('Error fetching all tutors:', err)
      return res.status(500).json({ error: 'Database error' })
    }
    const tutors = rows.map(row => {
      if (row.subjects) {
        try { row.subjects = JSON.parse(row.subjects) } catch (e) {}
      }
      return row
    })
    res.json(tutors)
  })
})

export default router
