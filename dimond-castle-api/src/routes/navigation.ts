import { Router } from 'express'
import Navigation from '../models/Navigation'
import { NavigationUpsertSchema } from '../validation/navigation'

const router = Router()

// Get by name
router.get('/:name', async (req, res, next) => {
  try {
    const doc = await Navigation.findOne({ name: req.params.name })
    if (!doc) {
      // Return an empty navigation instead of 404 for better DX
      return res.json({ name: req.params.name, items: [], updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() })
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Public shape
router.get('/public/:name', async (req, res, next) => {
  try {
    const doc = await Navigation.findOne({ name: req.params.name })
    if (!doc) {
      return res.json({ name: req.params.name, items: [], updatedAt: new Date().toISOString() })
    }

    const mapItem = (item: any) => ({
      labelEN: item.labelEN,
      labelAR: item.labelAR,
      href: item.href,
      visible: item.visible !== false,
      newTab: item.newTab === true,
      children: (item.children || []).map(mapItem),
    })

    const payload = {
      name: doc.get('name'),
      items: (doc.get('items') || []).map(mapItem),
      updatedAt: doc.get('updatedAt'),
    }
    res.json(payload)
  } catch (err) {
    next(err)
  }
})

// Upsert by name (create if missing)
router.put('/:name', async (req, res, next) => {
  try {
    const parsed = NavigationUpsertSchema.safeParse({ name: req.params.name, ...req.body })
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    const { name, items } = parsed.data
    const updated = await Navigation.findOneAndUpdate(
      { name },
      { name, items },
      { new: true, upsert: true }
    )
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// Optional: POST create (explicit)
router.post('/', async (req, res, next) => {
  try {
    const parsed = NavigationUpsertSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })

    const exists = await Navigation.findOne({ name: parsed.data.name })
    if (exists) return res.status(409).json({ error: 'Navigation already exists' })
    const created = await Navigation.create(parsed.data)
    res.status(201).json(created)
  } catch (err) {
    next(err)
  }
})

export default router


