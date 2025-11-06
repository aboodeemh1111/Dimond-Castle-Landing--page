import { Router } from 'express'
import Theme from '../models/Theme'
import { ThemeSchema, ThemeUpdateSchema, DEFAULT_THEME } from '../validation/theme'

const router = Router()

// Get current theme (public endpoint)
router.get('/', async (req, res, next) => {
  try {
    let theme = await Theme.findOne().lean()
    
    // If no theme exists, create default
    if (!theme) {
      theme = await Theme.create(DEFAULT_THEME)
    }
    
    res.json(theme)
  } catch (err) {
    next(err)
  }
})

// Update theme
router.put('/', async (req, res, next) => {
  try {
    const validated = ThemeUpdateSchema.parse(req.body)
    
    let theme = await Theme.findOne()
    
    if (!theme) {
      // Create new theme with defaults + updates
      theme = await Theme.create({ ...DEFAULT_THEME, ...validated })
    } else {
      // Update existing theme
      Object.assign(theme, validated)
      await theme.save()
    }
    
    res.json(theme)
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation failed', details: err.errors })
    }
    next(err)
  }
})

// Reset to default theme
router.post('/reset', async (req, res, next) => {
  try {
    let theme = await Theme.findOne()
    
    if (!theme) {
      theme = await Theme.create(DEFAULT_THEME)
    } else {
      Object.assign(theme, DEFAULT_THEME)
      await theme.save()
    }
    
    res.json(theme)
  } catch (err) {
    next(err)
  }
})

export default router

