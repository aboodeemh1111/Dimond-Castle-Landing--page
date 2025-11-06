import { Router } from 'express'
import Page from '../models/Page'
import { PageCreateSchema, PageUpdateSchema } from '../validation/pages'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const { q, status, page = '1', limit = '20', sort = '-updatedAt' } = req.query as any
    const where: any = {}
    if (status && ['draft','published'].includes(status)) where.status = status
    if (q) {
      where.$or = [
        { 'en.title': { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ]
    }
    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Page.find(where).sort(sort as string).skip(skip).limit(Number(limit)),
      Page.countDocuments(where),
    ])
    res.json({ items, total, page: Number(page), limit: Number(limit) })
  } catch (e) { next(e) }
})

router.get('/slug', async (req, res, next) => {
  try {
    const { slug } = req.query as any
    if (!slug) return res.status(400).json({ error: 'slug required' })
    const doc = await Page.findOne({ slug })
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Page.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const parsed = PageCreateSchema.parse(req.body)
    const exists = await Page.findOne({ slug: parsed.slug })
    if (exists) return res.status(409).json({ error: 'Slug already exists' })
    const doc = await Page.create(parsed)
    res.status(201).json(doc)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = PageUpdateSchema.parse(req.body)
    if (parsed.slug) {
      const exists = await Page.findOne({ slug: parsed.slug, _id: { $ne: req.params.id } })
      if (exists) return res.status(409).json({ error: 'Slug already exists' })
    }
    const doc = await Page.findByIdAndUpdate(req.params.id, parsed, { new: true })
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Page.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router


