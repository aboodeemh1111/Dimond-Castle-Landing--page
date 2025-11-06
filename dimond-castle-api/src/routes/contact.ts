import { Router } from 'express'
import ContactSettings from '../models/ContactSettings'
import ContactMessage from '../models/ContactMessage'
import { contactMessageCreateSchema, contactSettingsSchema, messageListQuerySchema } from '../validation/contact'

const router = Router()

// Settings: get
router.get('/settings', async (_req, res, next) => {
  try {
    let settings = await ContactSettings.findOne().sort({ updatedAt: -1 })
    if (!settings) {
      // return an empty doc shape for easier first-load UX
      return res.json({
        titleEN: '',
        titleAR: '',
        subtitleEN: '',
        subtitleAR: '',
        businessHours: [],
        phoneNumbers: [],
        whatsappNumbers: [],
        emails: [],
        addressesEN: [],
        addressesAR: [],
        socialLinks: {},
        updatedAt: new Date().toISOString(),
      })
    }
    res.json(settings)
  } catch (err) {
    next(err)
  }
})

// Settings: upsert (replace)
router.put('/settings', async (req, res, next) => {
  try {
    const parsed = contactSettingsSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const payload = parsed.data
    const saved = await ContactSettings.findOneAndUpdate({}, payload, { new: true, upsert: true })
    res.json(saved)
  } catch (err) {
    next(err)
  }
})

// Public create message
router.post('/', async (req, res, next) => {
  try {
    const parsed = contactMessageCreateSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const created = await ContactMessage.create({ ...parsed.data, submittedAt: new Date() })
    res.status(201).json({ ok: true, id: created._id })
  } catch (err) {
    next(err)
  }
})

// Admin: list messages
router.get('/messages', async (req, res, next) => {
  try {
    const parsed = messageListQuerySchema.safeParse(req.query)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const { q, status, page, limit } = parsed.data
    const filter: any = {}
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { phone: new RegExp(q, 'i') },
        { message: new RegExp(q, 'i') },
      ]
    }
    if (status && status !== 'all') {
      if (status === 'unseen') filter.seen = false
      if (status === 'resolved') filter.resolved = true
      if (status === 'unresolved') filter.resolved = { $ne: true }
    }

    const total = await ContactMessage.countDocuments(filter)
    const items = await ContactMessage.find(filter)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (err) {
    next(err)
  }
})

// Admin: update message flags
router.patch('/messages/:id', async (req, res, next) => {
  try {
    const { seen, resolved } = req.body as { seen?: boolean; resolved?: boolean }
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { $set: { ...(seen != null ? { seen } : {}), ...(resolved != null ? { resolved } : {}) } },
      { new: true }
    )
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (err) {
    next(err)
  }
})

// Admin: delete message
router.delete('/messages/:id', async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router


