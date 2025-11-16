import { Router } from 'express'
import ValuesSettings from '../models/ValuesSettings'
import { valuesSettingsSchema } from '../validation/vision-values'

const router = Router()

const defaultValues = {
  headingEN: 'Corporate Values & Objectives',
  headingAR: 'القيم المؤسسية والأهداف',
  items: [
    {
      titleEN: 'Integrity',
      titleAR: 'النزاهة',
      bodyEN: 'We consistently uphold honesty and transparency in all our dealings.',
      bodyAR: 'نلتزم بالصدق والشفافية في جميع تعاملاتنا.',
      icon: 'shield',
    },
    {
      titleEN: 'Leadership',
      titleAR: 'الريادة',
      bodyEN: 'Every individual is a leader within their area of responsibility.',
      bodyAR: 'كل فرد في شركتنا قائد ضمن نطاق مسؤوليته.',
      icon: 'flag',
    },
    {
      titleEN: 'Ownership',
      titleAR: 'الملكية',
      bodyEN: 'We take personal responsibility and treat company assets as our own.',
      bodyAR: 'نتحمل المسؤولية ونعامل أصول الشركة كأنها لنا.',
      icon: 'home',
    },
    {
      titleEN: 'Passion for Success',
      titleAR: 'الشغف بالنجاح',
      bodyEN: 'We push beyond the status quo to achieve excellence.',
      bodyAR: 'ندفع أنفسنا لتجاوز المألوف لتحقيق التميز.',
      icon: 'flame',
    },
    {
      titleEN: 'Trust',
      titleAR: 'الثقة',
      bodyEN: 'We treat colleagues and clients with respect and fairness.',
      bodyAR: 'نتعامل مع الزملاء والعملاء باحترام وعدل.',
      icon: 'shield-check',
    },
  ],
}

router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await ValuesSettings.findOne().sort({ updatedAt: -1 }).lean()
    if (!settings) return res.json(defaultValues)
    return res.json(settings)
  } catch (err) {
    return next(err)
  }
})

router.put('/settings', async (req, res, next) => {
  try {
    const parsed = valuesSettingsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }
    const payload = parsed.data
    const saved = await ValuesSettings.findOneAndUpdate({}, payload, { new: true, upsert: true, setDefaultsOnInsert: true })
    return res.json(saved)
  } catch (err) {
    return next(err)
  }
})

export default router


