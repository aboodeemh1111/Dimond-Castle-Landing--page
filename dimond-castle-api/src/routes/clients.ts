import { Router } from 'express'
import ClientSettings from '../models/ClientSettings'
import { clientSettingsSchema } from '../validation/clients'

const router = Router()

const defaultClients = [
  { nameEN: 'MS Logistics', nameAR: 'MS Logistics', logoUrl: '/images/partners/MS.png' },
  { nameEN: 'SAUDI MEDICAL SYSTEM', nameAR: 'النظام الطبي السعودي', logoUrl: '/images/partners/SVR.png' },
  {
    nameEN: 'Business Facilities',
    nameAR: 'اعمال المرافق',
    logoUrl: '/images/partners/اعمال-المرافق.png',
  },
  { nameEN: 'الباسم', nameAR: 'الباسم', logoUrl: '/images/partners/الباسم.png' },
  { nameEN: 'البيت الرومنسي', nameAR: 'البيت الرومنسي', logoUrl: '/images/partners/البيت-الرومنسي.png' },
  {
    nameEN: 'Gulf Catering Food Factory',
    nameAR: 'مصنع الخليج للتموين',
    logoUrl: '/images/partners/الخليج.png',
  },
  { nameEN: 'Atheeb Catering', nameAR: 'أثيب للتموين', logoUrl: '/images/partners/الذيب.png' },
  { nameEN: 'أسواق الرشيد', nameAR: 'أسواق الرشيد', logoUrl: '/images/partners/الرشيد.png' },
  { nameEN: 'الريم', nameAR: 'الريم', logoUrl: '/images/partners/الريم.png' },
  { nameEN: 'الصالة الاقتصادية', nameAR: 'الصالة الاقتصادية', logoUrl: '/images/partners/الصالة-الاقتصادية.png' },
  { nameEN: 'النبلاء', nameAR: 'النبلاء', logoUrl: '/images/partners/النبلاء.png' },
  { nameEN: 'إمداد', nameAR: 'إمداد', logoUrl: '/images/partners/امداد.png' },
  { nameEN: 'أوج', nameAR: 'أوج', logoUrl: '/images/partners/اوج.png' },
  { nameEN: 'Shawarma House', nameAR: 'بيت الشاورما', logoUrl: '/images/partners/بيت-الشاورما.png' },
  { nameEN: 'شركة فهد الرشيد', nameAR: 'شركة فهد الرشيد', logoUrl: '/images/partners/شركة-فهد.png' },
  { nameEN: 'شرما للاستثمار', nameAR: 'شرما للاستثمار', logoUrl: '/images/partners/شرما.png' },
  { nameEN: 'أسواق ضواحي الرمال', nameAR: 'أسواق ضواحي الرمال', logoUrl: '/images/partners/ضواحي-الرمال.png' },
  { nameEN: 'Gannas Arabia', nameAR: 'شركة قناص العربية', logoUrl: '/images/partners/قناص.png' },
  { nameEN: 'Consumer Stores', nameAR: 'متاجر المستهلك', logoUrl: '/images/partners/متاجر-المستهلك.png' },
  { nameEN: 'Hozoon', nameAR: 'هزون', logoUrl: '/images/partners/هزون.png' },
].map((client, index) => ({ ...client, order: index }))

const defaultResponse = {
  clients: defaultClients,
  updatedAt: new Date().toISOString(),
}

router.get('/settings', async (_req, res, next) => {
  try {
    const settings = await ClientSettings.findOne().lean()
    if (!settings || !settings.clients?.length) {
      return res.json(defaultResponse)
    }
    return res.json(settings)
  } catch (err) {
    return next(err)
  }
})

router.put('/settings', async (req, res, next) => {
  try {
    const parsed = clientSettingsSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() })
    }

    const payload = parsed.data

    const normalizedClients = payload.clients
      .map((client, index) => ({
        ...client,
        order: client.order ?? index,
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

    const saved = await ClientSettings.findOneAndUpdate(
      {},
      { clients: normalizedClients, updatedBy: payload.updatedBy },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    )

    return res.json(saved)
  } catch (err) {
    return next(err)
  }
})

export default router

