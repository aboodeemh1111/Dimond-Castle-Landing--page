import { Router } from 'express'
import SeoSettings from '../models/SeoSettings'
import { seoSettingsPatchSchema } from '../validation/seo'

const router = Router()

// Get SEO settings (create default if missing)
router.get('/', async (_req, res, next) => {
  try {
    let doc = await SeoSettings.findOne().lean()
    if (!doc) {
      const created = await SeoSettings.create({
        siteName: 'White Diamond',
        en: {
          siteTitle: 'White Diamond',
          siteDescription: 'Premium quality rice for discerning customers worldwide.',
          keywords: ['rice', 'white diamond', 'premium rice'],
        },
        ar: {
          siteTitle: 'الألماس الأبيض',
          siteDescription: 'أرز فاخر عالي الجودة لعملائنا المميزين حول العالم.',
          keywords: ['أرز', 'الألماس الأبيض', 'أرز فاخر'],
        },
      })
      return res.json(created)
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Public endpoint for website to fetch SEO settings
router.get('/public', async (_req, res, next) => {
  try {
    let doc = await SeoSettings.findOne().lean()
    if (!doc) {
      // Return defaults
      return res.json({
        siteName: 'White Diamond',
        en: {
          siteTitle: 'White Diamond',
          siteDescription: 'Premium quality rice for discerning customers worldwide.',
          keywords: [],
        },
        ar: {
          siteTitle: 'الألماس الأبيض',
          siteDescription: 'أرز فاخر عالي الجودة لعملائنا المميزين حول العالم.',
          keywords: [],
        },
        logoPublicId: '',
        ogImagePublicId: '',
        canonicalDomain: '',
        robotsIndex: true,
        robotsFollow: true,
      })
    }
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

// Patch SEO settings (merge)
router.patch('/', async (req, res, next) => {
  try {
    const parsed = seoSettingsPatchSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
    
    const update = parsed.data
    
    // Handle nested updates properly
    const flatUpdate: Record<string, any> = {}
    
    for (const [key, value] of Object.entries(update)) {
      if (key === 'en' || key === 'ar') {
        // For nested objects, set each field individually to allow partial updates
        if (value && typeof value === 'object') {
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            if (nestedValue !== undefined) {
              flatUpdate[`${key}.${nestedKey}`] = nestedValue
            }
          }
        }
      } else if (value !== undefined) {
        flatUpdate[key] = value
      }
    }
    
    const doc = await SeoSettings.findOneAndUpdate(
      {},
      { $set: flatUpdate },
      { new: true, upsert: true }
    )
    res.json(doc)
  } catch (err) {
    next(err)
  }
})

export default router

