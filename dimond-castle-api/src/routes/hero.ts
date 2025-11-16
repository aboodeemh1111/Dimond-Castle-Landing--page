import { Router } from 'express'
import HeroSettings from '../models/HeroSettings'
import { heroSettingsSchema } from '../validation/hero'

const router = Router()

const defaultHeroResponse = {
  titleLeadingEN: '',
  titleLeadingAR: '',
  titleTrailingEN: '',
  titleTrailingAR: '',
  subtitleEN: '',
  subtitleAR: '',
  scrollLabelEN: 'Scroll',
  scrollLabelAR: 'مرر للأسفل',
  primaryCta: {
    labelEN: '',
    labelAR: '',
    href: '#services',
  },
  secondaryCta: {
    labelEN: '',
    labelAR: '',
    href: '#about',
  },
  backgroundImagePublicId: '',
  overlayGradientStart: 'rgba(46,94,78,0.85)',
  overlayGradientEnd: 'rgba(212,175,55,0.35)',
  highlightOverlay: 'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent)',
  radialOverlayEnabled: true,
  updatedAt: new Date().toISOString(),
}

router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await HeroSettings.findOne().sort({ updatedAt: -1 }).lean()
    if (!settings) {
      return res.json(defaultHeroResponse)
    }
    return res.json(settings)
  } catch (err) {
    return next(err)
  }
})

router.put('/settings', async (req, res, next) => {
  try {
    const parsed = heroSettingsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const payload = parsed.data
    const saved = await HeroSettings.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    })
    return res.json(saved)
  } catch (err) {
    return next(err)
  }
})

export default router


