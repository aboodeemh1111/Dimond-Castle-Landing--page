import { Router } from 'express'
import { Types } from 'mongoose'
import ClientSettings, { type ClientSettingsDocument } from '../models/ClientSettings'
import { clientSettingsSchema } from '../validation/clients'

const router = Router()

const defaultClients = [
  { nameEN: 'MS Logistics', nameAR: 'MS Logistics', logoUrl: '/images/partners/MS.png', bgColor: '#FFFFFF' },
  { nameEN: 'SAUDI MEDICAL SYSTEM', nameAR: 'النظام الطبي السعودي', logoUrl: '/images/partners/SVR.png', bgColor: '#FFFFFF' },
  {
    nameEN: 'Business Facilities',
    nameAR: 'اعمال المرافق',
    logoUrl: '/images/partners/اعمال-المرافق.png',
    bgColor: '#FFFFFF',
  },
  { nameEN: 'الباسم', nameAR: 'الباسم', logoUrl: '/images/partners/الباسم.png', bgColor: '#FFFFFF' },
  { nameEN: 'البيت الرومنسي', nameAR: 'البيت الرومنسي', logoUrl: '/images/partners/البيت-الرومنسي.png', bgColor: '#FFFFFF' },
  {
    nameEN: 'Gulf Catering Food Factory',
    nameAR: 'مصنع الخليج للتموين',
    logoUrl: '/images/partners/الخليج.png',
    bgColor: '#FFFFFF',
  },
  { nameEN: 'Atheeb Catering', nameAR: 'أثيب للتموين', logoUrl: '/images/partners/الذيب.png', bgColor: '#FFFFFF' },
  { nameEN: 'أسواق الرشيد', nameAR: 'أسواق الرشيد', logoUrl: '/images/partners/الرشيد.png', bgColor: '#FFFFFF' },
  { nameEN: 'الريم', nameAR: 'الريم', logoUrl: '/images/partners/الريم.png', bgColor: '#FFFFFF' },
  { nameEN: 'الصالة الاقتصادية', nameAR: 'الصالة الاقتصادية', logoUrl: '/images/partners/الصالة-الاقتصادية.png', bgColor: '#FFFFFF' },
  { nameEN: 'النبلاء', nameAR: 'النبلاء', logoUrl: '/images/partners/النبلاء.png', bgColor: '#FFFFFF' },
  { nameEN: 'إمداد', nameAR: 'إمداد', logoUrl: '/images/partners/امداد.png', bgColor: '#FFFFFF' },
  { nameEN: 'أوج', nameAR: 'أوج', logoUrl: '/images/partners/اوج.png', bgColor: '#FFFFFF' },
  { nameEN: 'Shawarma House', nameAR: 'بيت الشاورما', logoUrl: '/images/partners/بيت-الشاورما.png', bgColor: '#FFFFFF' },
  { nameEN: 'شركة فهد الرشيد', nameAR: 'شركة فهد الرشيد', logoUrl: '/images/partners/شركة-فهد.png', bgColor: '#FFFFFF' },
  { nameEN: 'شرما للاستثمار', nameAR: 'شرما للاستثمار', logoUrl: '/images/partners/شرما.png', bgColor: '#FFFFFF' },
  { nameEN: 'أسواق ضواحي الرمال', nameAR: 'أسواق ضواحي الرمال', logoUrl: '/images/partners/ضواحي-الرمال.png', bgColor: '#FFFFFF' },
  { nameEN: 'Gannas Arabia', nameAR: 'شركة قناص العربية', logoUrl: '/images/partners/قناص.png', bgColor: '#FFFFFF' },
  { nameEN: 'Consumer Stores', nameAR: 'متاجر المستهلك', logoUrl: '/images/partners/متاجر-المستهلك.png', bgColor: '#FFFFFF' },
  { nameEN: 'Hozoon', nameAR: 'هزون', logoUrl: '/images/partners/هزون.png', bgColor: '#FFFFFF' },
].map((client, index) => ({ ...client, order: index }))

const defaultResponse = {
  clients: defaultClients,
  updatedAt: new Date().toISOString(),
}

router.get('/settings', async (_req, res, next) => {
  try {
    const settings = (await ClientSettings.findOne().lean()) as ClientSettingsDocument | null
    if (!settings || !settings.clients?.length) {
      return res.json(defaultResponse)
    }
    return res.json(settings)
  } catch (err) {
    // Log error but fall back to defaults so the admin UI keeps working
    console.error('Failed to load client settings', err)
    return res.json(defaultResponse)
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
      .map((client, index) => {
        const clean = { ...client }
        if (clean._id && !Types.ObjectId.isValid(clean._id)) {
          delete clean._id
        }
        return {
          ...clean,
          order: clean.order ?? index,
        }
      })
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

