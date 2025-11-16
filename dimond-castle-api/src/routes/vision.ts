import { Router } from 'express'
import VisionSettings from '../models/VisionSettings'
import { visionSettingsSchema } from '../validation/vision-values'

const router = Router()

const defaultVision = {
  headingEN: 'Vision, Mission & Strategic Objectives',
  headingAR: 'الرؤية والرسالة والأهداف الاستراتيجية',
  preambleEN:
    'Since its establishment, Diamond Castle Trading Company has built its foundation on a clear purpose, strong values, and guiding principles that define its unique corporate culture.',
  preambleAR:
    'منذ تأسيسها، بنت شركة قلعة الألماس للتجارة أسسها على هدف واضح وقيم راسخة ومبادئ توجّه ثقافتها المؤسسية.',
  cards: [
    {
      titleEN: 'Vision & Values',
      titleAR: 'الرؤية والقيم',
      bodyEN: 'We operate strategically to enhance the lives of more consumers every day.',
      bodyAR: 'نعمل باستراتيجية لتعزيز حياة المزيد من المستهلكين يوميًا.',
      icon: 'clock',
    },
    {
      titleEN: 'How We Operate',
      titleAR: 'آلية عملنا',
      bodyEN: 'Our employees strive to leave a positive impact every day, reflecting company values.',
      bodyAR: 'يحرص موظفونا على ترك أثر إيجابي كل يوم يعكس قيم الشركة.',
      icon: 'factory',
    },
    {
      titleEN: 'Our Goal — Today and Future',
      titleAR: 'هدفنا — اليوم وللمستقبل',
      bodyEN: 'Deliver high-quality products that improve lives across Saudi Arabia.',
      bodyAR: 'تقديم منتجات عالية الجودة تحسّن حياة المستهلكين في المملكة.',
      icon: 'star',
    },
  ],
}

router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await VisionSettings.findOne().sort({ updatedAt: -1 }).lean()
    if (!settings) return res.json(defaultVision)
    return res.json(settings)
  } catch (err) {
    return next(err)
  }
})

router.put('/settings', async (req, res, next) => {
  try {
    const parsed = visionSettingsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }
    const payload = parsed.data
    const saved = await VisionSettings.findOneAndUpdate({}, payload, { new: true, upsert: true, setDefaultsOnInsert: true })
    return res.json(saved)
  } catch (err) {
    return next(err)
  }
})

export default router


