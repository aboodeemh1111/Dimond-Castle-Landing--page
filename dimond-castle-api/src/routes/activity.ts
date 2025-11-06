import { Router } from 'express'
import BlogPost from '../models/BlogPost'
import Page from '../models/Page'
import Theme from '../models/Theme'
import Navigation from '../models/Navigation'

const router = Router()

router.get('/recent', async (req, res, next) => {
  try {
    const limit = Math.min(Number((req.query.limit as string) || '20'), 50)
    const [blogs, pages, theme, nav] = await Promise.all([
      BlogPost.find().sort({ updatedAt: -1 }).limit(limit).select('en.title updatedAt').lean(),
      Page.find().sort({ updatedAt: -1 }).limit(limit).select('en.title updatedAt').lean(),
      Theme.findOne().select('updatedAt').lean(),
      Navigation.find().sort({ updatedAt: -1 }).limit(1).select('name updatedAt').lean(),
    ])

    type Item = { type: 'blog' | 'page' | 'theme' | 'navigation'; title: string; updatedAt: string }
    const items: Item[] = []
    items.push(...blogs.map((b: any) => ({ type: 'blog', title: b.en?.title || 'Untitled', updatedAt: b.updatedAt })))
    items.push(...pages.map((p: any) => ({ type: 'page', title: p.en?.title || 'Untitled', updatedAt: p.updatedAt })))
    if (theme) items.push({ type: 'theme', title: 'Theme', updatedAt: (theme as any).updatedAt })
    if (nav && nav[0]) items.push({ type: 'navigation', title: `Navigation: ${(nav[0] as any).name}`, updatedAt: (nav[0] as any).updatedAt })

    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    res.json({ items: items.slice(0, limit) })
  } catch (err) {
    next(err)
  }
})

export default router


