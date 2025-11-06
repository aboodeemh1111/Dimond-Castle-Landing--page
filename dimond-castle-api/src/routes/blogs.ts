import { Router } from 'express'
import BlogPost from '../models/BlogPost'
import { BlogCreateSchema, BlogUpdateSchema } from '../validation/blogs'

const router = Router()

// Count endpoint
router.get('/count', async (req, res, next) => {
  try {
    const { status } = req.query as any
    const where: any = {}
    if (status && ['draft','published'].includes(status)) where.status = status
    const total = await BlogPost.countDocuments(where)
    res.json({ count: total })
  } catch (e) { next(e) }
})

// List with filters
router.get('/', async (req, res, next) => {
  try {
    const { q, status, page = '1', limit = '20', sort = '-updatedAt' } = req.query as any
    const where: any = {}
    if (status && ['draft','published'].includes(status)) where.status = status
    if (q) {
      where.$or = [
        { 'en.title': { $regex: q, $options: 'i' } },
        { 'ar.title': { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ]
    }
    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      BlogPost.find(where).sort(sort as string).skip(skip).limit(Number(limit)),
      BlogPost.countDocuments(where),
    ])
    res.json({ items, total, page: Number(page), limit: Number(limit) })
  } catch (e) { next(e) }
})

router.get('/slug/:slug', async (req, res, next) => {
  try {
    const doc = await BlogPost.findOne({ slug: req.params.slug })
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (e) { next(e) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const doc = await BlogPost.findById(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (e) { next(e) }
})

router.post('/', async (req, res, next) => {
  try {
    const parsed = BlogCreateSchema.parse(req.body)
    const exists = await BlogPost.findOne({ slug: parsed.slug })
    if (exists) return res.status(409).json({ error: 'Slug already exists' })
    const doc = await BlogPost.create(parsed)
    res.status(201).json(doc)
  } catch (e) { next(e) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const parsed = BlogUpdateSchema.parse(req.body)
    if (parsed.slug) {
      const exists = await BlogPost.findOne({ slug: parsed.slug, _id: { $ne: req.params.id } })
      if (exists) return res.status(409).json({ error: 'Slug already exists' })
    }
    const doc = await BlogPost.findByIdAndUpdate(req.params.id, parsed, { new: true })
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (e) { next(e) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await BlogPost.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json({ ok: true })
  } catch (e) { next(e) }
})

export default router


