import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import pg from 'pg'
import { z } from 'zod'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const database = process.env.DATABASE || 'memory'

app.use(cors())
app.use(express.json())

const scheduleSchema = z.object({
  title: z.string().min(1),
  day: z.string().min(1),
  start: z.string().min(1),
  end: z.string().min(1),
  category: z.string().min(1),
  room: z.string().default(''),
  owner: z.string().default(''),
  priority: z.enum(['Cao', 'Vừa', 'Thấp']).default('Vừa'),
  progress: z.number().min(0).max(100).default(0),
  notes: z.string().default(''),
})

let memorySchedules = [
  { id: 1, title: 'Toán cao cấp', day: 'Thứ 2', start: '08:00', end: '09:45', category: 'Học', room: 'A204', owner: 'Nhóm A', priority: 'Cao', progress: 76, notes: 'Ôn đạo hàm riêng.' },
  { id: 2, title: 'Sprint planning', day: 'Thứ 2', start: '13:00', end: '14:00', category: 'Làm', room: 'Google Meet', owner: 'Product Team', priority: 'Cao', progress: 92, notes: 'Chốt timeline tuần.' },
]

const mongoScheduleSchema = new mongoose.Schema({
  title: String,
  day: String,
  start: String,
  end: String,
  category: String,
  room: String,
  owner: String,
  priority: String,
  progress: Number,
  notes: String,
}, { timestamps: true })
const MongoSchedule = mongoose.models.Schedule || mongoose.model('Schedule', mongoScheduleSchema)
const postgres = new pg.Pool({ connectionString: process.env.POSTGRES_URL })

async function initDatabase() {
  if (database === 'mongo' && process.env.MONGO_URL) {
    await mongoose.connect(process.env.MONGO_URL)
  }
  if (database === 'postgres' && process.env.POSTGRES_URL) {
    await postgres.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        day TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        category TEXT NOT NULL,
        room TEXT DEFAULT '',
        owner TEXT DEFAULT '',
        priority TEXT DEFAULT 'Vừa',
        progress INTEGER DEFAULT 0,
        notes TEXT DEFAULT ''
      )
    `)
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, database })
})

app.get('/api/schedules', async (_req, res, next) => {
  try {
    if (database === 'mongo' && process.env.MONGO_URL) {
      const schedules = await MongoSchedule.find().sort({ createdAt: -1 })
      return res.json(schedules)
    }
    if (database === 'postgres' && process.env.POSTGRES_URL) {
      const { rows } = await postgres.query('SELECT id, title, day, start_time AS start, end_time AS end, category, room, owner, priority, progress, notes FROM schedules ORDER BY id DESC')
      return res.json(rows)
    }
    res.json(memorySchedules)
  } catch (error) {
    next(error)
  }
})

app.post('/api/schedules', async (req, res, next) => {
  try {
    const payload = scheduleSchema.parse(req.body)
    if (database === 'mongo' && process.env.MONGO_URL) {
      const schedule = await MongoSchedule.create(payload)
      return res.status(201).json(schedule)
    }
    if (database === 'postgres' && process.env.POSTGRES_URL) {
      const { rows } = await postgres.query(
        'INSERT INTO schedules (title, day, start_time, end_time, category, room, owner, priority, progress, notes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id, title, day, start_time AS start, end_time AS end, category, room, owner, priority, progress, notes',
        [payload.title, payload.day, payload.start, payload.end, payload.category, payload.room, payload.owner, payload.priority, payload.progress, payload.notes],
      )
      return res.status(201).json(rows[0])
    }
    const schedule = { id: Date.now(), ...payload }
    memorySchedules = [schedule, ...memorySchedules]
    res.status(201).json(schedule)
  } catch (error) {
    next(error)
  }
})

app.put('/api/schedules/:id', async (req, res, next) => {
  try {
    const payload = scheduleSchema.parse(req.body)
    const { id } = req.params
    if (database === 'mongo' && process.env.MONGO_URL) {
      const schedule = await MongoSchedule.findByIdAndUpdate(id, payload, { new: true })
      return res.json(schedule)
    }
    if (database === 'postgres' && process.env.POSTGRES_URL) {
      const { rows } = await postgres.query(
        'UPDATE schedules SET title=$1, day=$2, start_time=$3, end_time=$4, category=$5, room=$6, owner=$7, priority=$8, progress=$9, notes=$10 WHERE id=$11 RETURNING id, title, day, start_time AS start, end_time AS end, category, room, owner, priority, progress, notes',
        [payload.title, payload.day, payload.start, payload.end, payload.category, payload.room, payload.owner, payload.priority, payload.progress, payload.notes, id],
      )
      return res.json(rows[0])
    }
    memorySchedules = memorySchedules.map((schedule) => String(schedule.id) === id ? { id: schedule.id, ...payload } : schedule)
    res.json(memorySchedules.find((schedule) => String(schedule.id) === id))
  } catch (error) {
    next(error)
  }
})

app.delete('/api/schedules/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    if (database === 'mongo' && process.env.MONGO_URL) {
      await MongoSchedule.findByIdAndDelete(id)
      return res.status(204).end()
    }
    if (database === 'postgres' && process.env.POSTGRES_URL) {
      await postgres.query('DELETE FROM schedules WHERE id=$1', [id])
      return res.status(204).end()
    }
    memorySchedules = memorySchedules.filter((schedule) => String(schedule.id) !== id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ', issues: error.issues })
  }
  res.status(500).json({ message: error.message || 'Lỗi máy chủ' })
})

initDatabase().then(() => {
  app.listen(port, () => console.log(`TimeCraft API running on http://localhost:${port}`))
})
