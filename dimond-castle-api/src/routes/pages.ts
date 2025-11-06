import { Router } from 'express'
import Page from '../models/Page'
import { PageCreateSchema, PageUpdateSchema } from '../validation/pages'

const router = Router()

// Count endpoint
router.get('/count', async (req, res, next) => {
  try {
    const { status } = req.query as any
    const query: any = {}
    if (status && (status === 'draft' || status === 'published')) query.status = status
    const total = await Page.countDocuments(query)
    res.json({ count: total })
  } catch (err) { next(err) }
})

// List pages with search and filters
router.get('/', async (req, res, next) => {
  try {
    const { q, status, page = '1', limit = '20' } = req.query

    const query: any = {}

    // Search by title or slug
    if (q && typeof q === 'string') {
      query.$or = [
        { 'en.title': { $regex: q, $options: 'i' } },
        { 'ar.title': { $regex: q, $options: 'i' } },
        { slug: { $regex: q, $options: 'i' } },
      ]
    }

    // Filter by status
    if (status && (status === 'draft' || status === 'published')) {
      query.status = status
    }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Page.countDocuments(query)
    const items = await Page.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('slug status en.title ar.title updatedAt createdAt')
      .lean()

    res.json({
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (err) {
    next(err)
  }
})

// Get page by ID
router.get('/:id', async (req, res, next) => {
  try {
    const page = await Page.findById(req.params.id).lean()
    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }
    res.json(page)
  } catch (err) {
    next(err)
  }
})

// Get page by slug (public endpoint)
router.get('/slug/:slug', async (req, res, next) => {
  try {
    const slug = '/' + req.params.slug
    const page = await Page.findOne({ slug, status: 'published' }).lean()
    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }
    res.json(page)
  } catch (err) {
    next(err)
  }
})

// Create page
router.post('/', async (req, res, next) => {
  try {
    const validated = PageCreateSchema.parse(req.body)

    // Check slug uniqueness
    const existing = await Page.findOne({ slug: validated.slug })
    if (existing) {
      return res.status(400).json({ error: 'Slug already exists' })
    }

    const page = await Page.create(validated)
    res.status(201).json(page)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors })
    }
    next(err)
  }
})

// Update page
router.put('/:id', async (req, res, next) => {
  try {
    const validated = PageUpdateSchema.parse(req.body)

    // Check slug uniqueness if slug is being updated
    if (validated.slug) {
      const existing = await Page.findOne({ slug: validated.slug, _id: { $ne: req.params.id } })
      if (existing) {
        return res.status(400).json({ error: 'Slug already exists' })
      }
    }

    const page = await Page.findByIdAndUpdate(req.params.id, validated, { new: true, runValidators: true })
    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    res.json(page)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors })
    }
    next(err)
  }
})

// Delete page
router.delete('/:id', async (req, res, next) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id)
    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }
    res.json({ message: 'Page deleted successfully' })
  } catch (err) {
    next(err)
  }
})

// Check slug availability
router.post('/check-slug', async (req, res, next) => {
  try {
    const { slug, excludeId } = req.body
    const query: any = { slug }
    if (excludeId) {
      query._id = { $ne: excludeId }
    }
    const existing = await Page.findOne(query)
    res.json({ available: !existing })
  } catch (err) {
    next(err)
  }
})

export default router
