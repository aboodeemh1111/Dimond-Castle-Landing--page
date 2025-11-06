import { Router } from 'express'
import Settings from '../models/Settings'
import { settingsPatchSchema } from '../validation/settings'
import Theme from '../models/Theme'
import Navigation from '../models/Navigation'
import Page from '../models/Page'
import BlogPost from '../models/BlogPost'
import ContactMessage from '../models/ContactMessage'

const router = Router()

// Get settings (create default if missing)
router.get('/', async (_req, res, next) => {
  try {
    let doc = await Settings.findOne().lean()
    if (!doc) {
      const created = await Settings.create({ companyName: 'Company' })
      return res.json(created)
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Patch settings (merge)
router.patch('/', async (req, res, next) => {
  try {
    const parsed = settingsPatchSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    const update = parsed.data
    const doc = await Settings.findOneAndUpdate({}, update, { new: true, upsert: true })
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Exports
router.get('/export/pages', async (_req, res, next) => {
  try {
    const items = await Page.find().lean()
    res.json({ items })
  } catch (err) { next(err) }
})

router.get('/export/blogs', async (_req, res, next) => {
  try {
    const items = await BlogPost.find().lean()
    res.json({ items })
  } catch (err) { next(err) }
})

router.get('/export/config', async (_req, res, next) => {
  try {
    const [settings, theme, nav] = await Promise.all([
      Settings.findOne().lean(),
      Theme.findOne().lean(),
      Navigation.find().lean(),
    ])
    res.json({ settings, theme, navigation: nav })
  } catch (err) { next(err) }
})

router.get('/export/all', async (_req, res, next) => {
  try {
    const [settings, theme, nav, pages, blogs] = await Promise.all([
      Settings.findOne().lean(),
      Theme.findOne().lean(),
      Navigation.find().lean(),
      Page.find().lean(),
      BlogPost.find().lean(),
    ])
    res.json({ settings, theme, navigation: nav, pages, blogs })
  } catch (err) { next(err) }
})

// Danger zone actions
router.post('/danger/clear-drafts', async (_req, res, next) => {
  try {
    const posts = await BlogPost.deleteMany({ status: 'draft' })
    const pages = await Page.deleteMany({ status: 'draft' })
    res.json({ ok: true, deleted: { blogDrafts: posts.deletedCount, pageDrafts: pages.deletedCount } })
  } catch (err) { next(err) }
})

router.post('/danger/clear-messages', async (_req, res, next) => {
  try {
    const result = await ContactMessage.deleteMany({})
    res.json({ ok: true, deleted: result.deletedCount })
  } catch (err) { next(err) }
})

router.post('/danger/reset-settings', async (_req, res, next) => {
  try {
    await Settings.deleteMany({})
    const created = await Settings.create({ companyName: 'Company' })
    res.json({ ok: true, settings: created })
  } catch (err) { next(err) }
})

export default router


