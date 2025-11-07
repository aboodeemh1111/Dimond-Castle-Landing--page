import { Router } from 'express'
import Product from '../models/Product'
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from '../validation/products'

const router = Router()

// ===== PUBLIC ROUTES =====

// Get all published products (for website)
router.get('/public', async (req, res) => {
  try {
    const query = productQuerySchema.parse({
      ...req.query,
      status: 'published',
      limit: req.query.limit ? Number(req.query.limit) : 50,
      skip: req.query.skip ? Number(req.query.skip) : 0,
      featured: req.query.featured === 'true' ? true : undefined,
      inStock: req.query.inStock === 'true' ? true : undefined,
    })

    const filter: any = { status: 'published' }
    
    if (query.category) filter.category = query.category
    if (query.featured !== undefined) filter.featured = query.featured
    if (query.inStock !== undefined) filter.inStock = query.inStock
    if (query.search) {
      filter.$text = { $search: query.search }
    }

    let sortOption: any = { order: 1, createdAt: -1 }
    switch (query.sort) {
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'name':
        sortOption = { 'en.name': 1 }
        break
      case 'popular':
        sortOption = { viewCount: -1, createdAt: -1 }
        break
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(query.limit)
      .skip(query.skip)
      .select('-__v')
      .lean()

    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        total,
        limit: query.limit,
        skip: query.skip,
        hasMore: query.skip + query.limit < total,
      },
    })
  } catch (error: any) {
    console.error('Error fetching public products:', error)
    res.status(400).json({ error: error.message || 'Failed to fetch products' })
  }
})

// Get single published product by slug (for website)
router.get('/public/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      status: 'published',
    })
      .select('-__v')
      .lean() as any

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Increment view count
    await Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } })

    res.json(product)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// ===== ADMIN ROUTES (Add authentication middleware in production) =====

// Get all products (admin)
router.get('/', async (req, res) => {
  try {
    const query = productQuerySchema.parse({
      ...req.query,
      status: req.query.status || 'all',
      limit: req.query.limit ? Number(req.query.limit) : 50,
      skip: req.query.skip ? Number(req.query.skip) : 0,
      featured: req.query.featured === 'true' ? true : undefined,
      inStock: req.query.inStock === 'true' ? true : undefined,
    })

    const filter: any = {}
    
    if (query.status && query.status !== 'all') filter.status = query.status
    if (query.category) filter.category = query.category
    if (query.featured !== undefined) filter.featured = query.featured
    if (query.inStock !== undefined) filter.inStock = query.inStock
    if (query.search) {
      filter.$text = { $search: query.search }
    }

    let sortOption: any = { order: 1, createdAt: -1 }
    switch (query.sort) {
      case 'newest':
        sortOption = { createdAt: -1 }
        break
      case 'oldest':
        sortOption = { createdAt: 1 }
        break
      case 'name':
        sortOption = { 'en.name': 1 }
        break
      case 'popular':
        sortOption = { viewCount: -1, createdAt: -1 }
        break
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(query.limit)
      .skip(query.skip)
      .select('-__v')
      .lean()

    const total = await Product.countDocuments(filter)

    res.json({
      products,
      pagination: {
        total,
        limit: query.limit,
        skip: query.skip,
        hasMore: query.skip + query.limit < total,
      },
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    res.status(400).json({ error: error.message || 'Failed to fetch products' })
  }
})

// Get single product by ID (admin)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v').lean()

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error: any) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Create new product (admin)
router.post('/', async (req, res) => {
  try {
    const data = createProductSchema.parse(req.body)

    // Check if slug already exists
    const existing = await Product.findOne({ slug: data.slug })
    if (existing) {
      return res.status(400).json({ error: 'Product with this slug already exists' })
    }

    const product = await Product.create(data)
    res.status(201).json(product)
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message || 'Failed to create product' })
  }
})

// Update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const data = updateProductSchema.parse(req.body)

    // If slug is being updated, check it doesn't conflict
    if (data.slug) {
      const existing = await Product.findOne({
        slug: data.slug,
        _id: { $ne: req.params.id },
      })
      if (existing) {
        return res.status(400).json({ error: 'Product with this slug already exists' })
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-__v')

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors })
    }
    res.status(500).json({ error: error.message || 'Failed to update product' })
  }
})

// Delete product (admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully', product })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Bulk update product order (admin)
router.post('/bulk/reorder', async (req, res) => {
  try {
    const { products } = req.body

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' })
    }

    const updates = products.map((item: any, index: number) =>
      Product.updateOne({ _id: item.id }, { $set: { order: index } })
    )

    await Promise.all(updates)

    res.json({ message: 'Product order updated successfully' })
  } catch (error: any) {
    console.error('Error reordering products:', error)
    res.status(500).json({ error: 'Failed to reorder products' })
  }
})

// Get product categories (admin)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category')
    res.json(categories.filter(Boolean))
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

export default router

