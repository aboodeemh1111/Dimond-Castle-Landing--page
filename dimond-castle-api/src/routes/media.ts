import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'
import { env } from '../config/env'
import BlogPost from '../models/BlogPost'
import Page from '../models/Page'

const router = Router()

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const basename = path.basename(file.originalname, ext)
    cb(null, `${basename}-${uniqueSuffix}${ext}`)
  }
})

// File filter for images and videos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image and video files are allowed!'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
})

// Upload files
router.post('/', upload.array('files', 10), async (req, res, next) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    const files = req.files as Express.Multer.File[]
    const uploadedFiles = files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' : 'video'
    }))

    res.json({ files: uploadedFiles })
  } catch (e) { next(e) }
})

// List uploaded files
router.get('/', async (req, res, next) => {
  try {
    const { q = '', type = 'all', page = '1', limit = '30' } = req.query as any
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 30
    const skip = (pageNum - 1) * limitNum

    try {
      const files = await fs.readdir(env.UPLOAD_DIR)
      let filteredFiles = files.filter(file => !file.startsWith('.'))

      // Filter by type
      if (type === 'image') {
        const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        filteredFiles = filteredFiles.filter(file =>
          imageExts.some(ext => file.toLowerCase().endsWith(ext))
        )
      } else if (type === 'video') {
        const videoExts = ['.mp4', '.webm', '.mov']
        filteredFiles = filteredFiles.filter(file =>
          videoExts.some(ext => file.toLowerCase().endsWith(ext))
        )
      }

      // Filter by query
      if (q) {
        filteredFiles = filteredFiles.filter(file =>
          file.toLowerCase().includes(q.toLowerCase())
        )
      }

      // Sort by creation time (newest first)
      const filesWithStats = await Promise.all(
        filteredFiles.map(async (file) => {
          try {
            const stats = await fs.stat(path.join(env.UPLOAD_DIR, file))
            return { file, createdAt: stats.birthtime || stats.mtime }
          } catch {
            return { file, createdAt: new Date(0) }
          }
        })
      )

      filesWithStats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      const paginatedFiles = filesWithStats.slice(skip, skip + limitNum)

      const items = paginatedFiles.map(({ file }) => ({
        filename: file,
        url: `/uploads/${file}`,
        type: ['.jpg', '.jpeg', '.png', '.gif', '.webp'].some(ext =>
          file.toLowerCase().endsWith(ext)
        ) ? 'image' : 'video'
      }))

      res.json({
        items,
        total_count: filteredFiles.length,
        page: pageNum,
        limit: limitNum,
        has_more: skip + limitNum < filteredFiles.length
      })
    } catch (fsError) {
      // If uploads directory doesn't exist or is empty, return empty results
      res.json({ items: [], total_count: 0, page: pageNum, limit: limitNum, has_more: false })
    }
  } catch (e) { next(e) }
})

// Count uploaded files
router.get('/count', async (_req, res, next) => {
  try {
    try {
      const files = await fs.readdir(env.UPLOAD_DIR)
      const mediaFiles = files.filter(file =>
        !file.startsWith('.') &&
        (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.mov'].some(ext =>
          file.toLowerCase().endsWith(ext)
        ))
      )
      res.json({ count: mediaFiles.length })
    } catch {
      res.json({ count: 0 })
    }
  } catch (e) { next(e) }
})

// Check usage of a file by filename
router.get('/usage', async (req, res, next) => {
  try {
    const { filename } = req.query as any
    if (!filename) return res.status(400).json({ error: 'filename is required' })

    // For local files, we need to check relative URLs like /uploads/filename.jpg
    const relativeUrl = `/uploads/${filename}`

    // Check blog posts for cover images and blocks
    const coverCount = await BlogPost.countDocuments({ coverImage: relativeUrl })
    const blocksCount = await BlogPost.countDocuments({
      $or: [
        { 'en.blocks': { $elemMatch: { imageUrl: relativeUrl } } },
        { 'ar.blocks': { $elemMatch: { imageUrl: relativeUrl } } },
        { 'en.blocks': { $elemMatch: { videoUrl: relativeUrl } } },
        { 'ar.blocks': { $elemMatch: { videoUrl: relativeUrl } } },
      ],
    })

    const posts = await BlogPost.find({
      $or: [
        { coverImage: relativeUrl },
        { 'en.blocks': { $elemMatch: { imageUrl: relativeUrl } } },
        { 'ar.blocks': { $elemMatch: { imageUrl: relativeUrl } } },
        { 'en.blocks': { $elemMatch: { videoUrl: relativeUrl } } },
        { 'ar.blocks': { $elemMatch: { videoUrl: relativeUrl } } },
      ],
    }).select({ _id: 1, slug: 1, 'en.title': 1 }).limit(50)

    // Check pages for ogImage fields
    const pagesCount = await Page.countDocuments({
      $or: [
        { 'en.seo.ogImage': relativeUrl },
        { 'ar.seo.ogImage': relativeUrl },
      ],
    })

    res.json({
      blog: { coverCount, blocksCount, total: Math.max(coverCount, 0) + Math.max(blocksCount, 0), posts },
      pages: { total: pagesCount },
    })
  } catch (e) { next(e) }
})

// Delete a file by filename
router.delete('/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params
    const filePath = path.join(env.UPLOAD_DIR, filename)

    try {
      await fs.unlink(filePath)
      res.json({ success: true, message: 'File deleted successfully' })
    } catch (fsError: any) {
      if (fsError.code === 'ENOENT') {
        return res.status(404).json({ error: 'File not found' })
      }
      throw fsError
    }
  } catch (e) { next(e) }
})

export default router


