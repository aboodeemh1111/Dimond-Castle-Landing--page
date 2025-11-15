import { Router } from 'express'
import fs from 'fs/promises'
import path from 'path'
import multer from 'multer'
import { env } from '../config/env'
import BlogPost from '../models/BlogPost'
import Page from '../models/Page'
import Product from '../models/Product'

const router = Router()

// Ensure upload directory exists
const uploadDir = path.resolve(env.UPLOAD_DIR)
fs.mkdir(uploadDir, { recursive: true }).catch(() => {})

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, `${unique}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only images and videos are allowed'))
    }
  },
})

// Count assets (images + videos)
router.get('/count', async (_req, res, next) => {
  try {
    const files = await fs.readdir(uploadDir).catch(() => [])
    const mediaFiles = files.filter(file =>
      /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i.test(file)
    )
    res.json({ count: mediaFiles.length })
  } catch (e) {
    res.json({ count: 0 })
  }
})

// Upload media file
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const publicId = req.file.filename
    const baseUrl = env.MEDIA_BASE_URL || `${req.protocol}://${req.get('host')}/media`
    const url = `${baseUrl}/${publicId}`

    const isVideo = req.file.mimetype.startsWith('video/')

    res.json({
      asset_id: publicId,
      public_id: publicId,
      resource_type: isVideo ? 'video' : 'image',
      format: path.extname(req.file.originalname).slice(1),
      bytes: req.file.size,
      width: null, // We don't extract dimensions
      height: null,
      url,
      secure_url: url,
      created_at: new Date().toISOString(),
    })
  } catch (e) {
    next(e)
  }
})

// Usage check for a given public_id
router.get('/usage', async (req, res, next) => {
  try {
    const { publicId } = req.query as any
    if (!publicId) return res.status(400).json({ error: 'publicId is required' })

    // Check blog posts
    const coverCount = await BlogPost.countDocuments({ coverPublicId: publicId })
    const blocksCount = await BlogPost.countDocuments({
      $or: [
        { 'en.blocks': { $elemMatch: { publicId } } },
        { 'ar.blocks': { $elemMatch: { publicId } } },
        { 'en.blocks': { $elemMatch: { posterId: publicId } } },
        { 'ar.blocks': { $elemMatch: { posterId: publicId } } },
      ],
    })
    const posts = await BlogPost.find({
      $or: [
        { coverPublicId: publicId },
        { 'en.blocks': { $elemMatch: { publicId } } },
        { 'ar.blocks': { $elemMatch: { publicId } } },
        { 'en.blocks': { $elemMatch: { posterId: publicId } } },
        { 'ar.blocks': { $elemMatch: { posterId: publicId } } },
      ],
    }).select({ _id: 1, slug: 1, 'en.title': 1 }).limit(50)

    // Check pages
    const pagesCount = await Page.countDocuments({
      $or: [
        { 'en.seo.ogImageId': publicId },
        { 'ar.seo.ogImageId': publicId },
      ],
    })

    // Check products
    const productsCount = await Product.countDocuments({
      $or: [
        { coverPublicId: publicId },
        { galleryPublicIds: publicId },
      ],
    })

    res.json({
      blog: { coverCount, blocksCount, total: Math.max(coverCount, 0) + Math.max(blocksCount, 0), posts },
      pages: { total: pagesCount },
      products: { total: productsCount },
    })
  } catch (e) { next(e) }
})

// List media (scan local directory)
router.get('/', async (req, res, next) => {
  try {
    const { q = '', type = 'all', max_results = '30' } = req.query as any

    let files = await fs.readdir(uploadDir).catch(() => [])
    const baseUrl = env.MEDIA_BASE_URL || `${req.protocol}://${req.get('host')}/media`

    // Filter by type
    if (type === 'image') {
      files = files.filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
    } else if (type === 'video') {
      files = files.filter(file => /\.(mp4|webm|mov)$/i.test(file))
    } else {
      files = files.filter(file => /\.(jpg|jpeg|png|webp|gif|mp4|webm|mov)$/i.test(file))
    }

    // Filter by query (simple filename matching)
    if (q) {
      files = files.filter(file => file.toLowerCase().includes(q.toLowerCase()))
    }

    // Sort by creation time (descending)
    const filesWithStats = await Promise.all(
      files.map(async file => {
        try {
          const stats = await fs.stat(path.join(uploadDir, file))
          return { file, mtime: stats.mtime }
        } catch {
          return { file, mtime: new Date(0) }
        }
      })
    )
    filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    files = filesWithStats.slice(0, Number(max_results)).map(f => f.file)

    // Convert to MediaItem format
    const items = files.map(file => ({
      asset_id: file,
      public_id: file,
      resource_type: /\.(mp4|webm|mov)$/i.test(file) ? 'video' : 'image',
      format: path.extname(file).slice(1),
      bytes: 0, // We could get file size but skipping for now
      width: null,
      height: null,
      created_at: filesWithStats.find(f => f.file === file)?.mtime.toISOString() || new Date().toISOString(),
      url: `${baseUrl}/${file}`,
      secure_url: `${baseUrl}/${file}`,
    }))

    res.json({
      items,
      total_count: items.length,
      next_cursor: null // Not implementing pagination for local files
    })
  } catch (e) {
    next(e)
  }
})

// Delete a media asset by public_id
router.delete('/:publicId', async (req, res, next) => {
  try {
    const { publicId } = req.params
    const filePath = path.join(uploadDir, publicId)

    try {
      await fs.unlink(filePath)
      res.json({ result: 'ok' })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        res.json({ result: 'not found' })
      } else {
        throw error
      }
    }
  } catch (e) {
    next(e)
  }
})

export default router


