import express from 'express'
import db from './db'
import { COUNTRIES } from './countries'

const app = express()
app.use(express.json()) // lets us read JSON request bodies

// --- BONUS: country metadata (single source of truth) ---

// List all supported countries
app.get('/api/countries', (req, res) => {
  const list = Object.entries(COUNTRIES).map(([code, c]) => ({
    code,
    label: c.label,
  }))
  res.json(list)
})

// Get the field schema for one country (frontend renders fields from this)
app.get('/api/countries/:code', (req, res) => {
  const country = COUNTRIES[req.params.code]
  if (!country) return res.status(404).json({ error: 'Unknown country' })
  res.json(country)
})

// --- Save an address ---

app.post('/api/addresses', (req, res) => {
  const { country, fields } = req.body
  const config = COUNTRIES[country]

  if (!config) {
    return res.status(400).json({ error: 'Unknown country' })
  }

  // Validate against the same config the frontend uses
  const errors: Record<string, string> = {}
  for (const field of config.fields) {
    const value = fields?.[field.name]

    if (field.required && !value) {
      errors[field.name] = `${field.label} is required`
      continue
    }
    if (value && field.pattern && !new RegExp(field.pattern).test(value)) {
      errors[field.name] = `${field.label} format is invalid`
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors })
  }

  // Store: fields go in as a JSON string
  const result = db
    .prepare('INSERT INTO addresses (country, fields) VALUES (?, ?)')
    .run(country, JSON.stringify(fields))

  res.status(201).json({ id: result.lastInsertRowid })
})

// --- Retrieve saved addresses (demo) ---

app.get('/api/addresses', (req, res) => {
  const rows = db.prepare('SELECT * FROM addresses ORDER BY id DESC').all() as any[]

  // Parse the JSON string back into an object before sending
  const addresses = rows.map((row) => ({
    id: row.id,
    country: row.country,
    fields: JSON.parse(row.fields),
    created_at: row.created_at,
  }))

  res.json(addresses)
})

app.listen(3001, () => {
  console.log('API running on http://localhost:3001')
})