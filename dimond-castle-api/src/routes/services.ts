import { Router } from 'express'
import Services from '../models/Services'
import { servicesUpsertSchema } from '../validation/services'

const router = Router()

// Get current services config (create with defaults if missing)
router.get('/', async (_req, res, next) => {
  try {
    let doc = await Services.findOne().lean()
    if (!doc) {
      const created = await Services.create({})
      return res.json(created)
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Public shape (same for now, but could be narrowed later)
router.get('/public', async (_req, res, next) => {
  try {
    let doc = await Services.findOne().lean()
    if (!doc) {
      doc = (await Services.create({})).toObject()
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Upsert full services config
router.put('/', async (req, res, next) => {
  try {
    const parsed = servicesUpsertSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const update = parsed.data
    const doc = await Services.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

export default router



