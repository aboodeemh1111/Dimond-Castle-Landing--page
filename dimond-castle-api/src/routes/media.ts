import { Router } from 'express'
import { cloudinary } from '../config/cloudinary'
import { env } from '../config/env'

const router = Router()

// Get signed upload parameters
router.post('/signature', async (req, res, next) => {
  try {
    const { folder = '', public_id, resource_type = 'auto', eager, tags } = req.body || {}
    const timestamp = Math.floor(Date.now() / 1000)

    const paramsToSign: Record<string, any> = {
      timestamp,
      folder,
    }
    if (public_id) paramsToSign.public_id = public_id
    if (eager) paramsToSign.eager = eager
    if (tags) paramsToSign.tags = tags

    const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET)
    res.json({
      timestamp,
      signature,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      folder,
      resource_type,
    })
  } catch (e) { next(e) }
})

// List media (images/videos) via Cloudinary Search API
router.get('/', async (req, res, next) => {
  try {
    const { q = '', type = 'all', page = '1', max_results = '30', folder } = req.query as any
    const expressions: string[] = []
    if (type === 'image') expressions.push('resource_type:image')
    if (type === 'video') expressions.push('resource_type:video')
    if (folder) expressions.push(`folder:${folder}`)
    if (q) expressions.push(`public_id:${q}* OR tags=${q}* OR context.alt:${q}* OR context.caption:${q}*`)

    const expression = expressions.length ? expressions.join(' AND ') : ''

    const search = cloudinary.search
      .expression(expression || 'resource_type:image OR resource_type:video')
      .sort_by('created_at', 'desc')
      .max_results(Number(max_results))

    const result = await search.execute()

    res.json({ items: result.resources, total_count: result.total_count, next_cursor: result.next_cursor })
  } catch (e) { next(e) }
})

// Delete a media asset by public_id
router.delete('/:publicId', async (req, res, next) => {
  try {
    const { publicId } = req.params
    // Attempt to delete as image first, fallback to video
    const img = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
    if (img.result === 'not found') {
      const vid = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
      return res.json(vid)
    }
    res.json(img)
  } catch (e) { next(e) }
})

export default router


