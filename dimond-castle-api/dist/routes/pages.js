"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Page_1 = __importDefault(require("../models/Page"));
const pages_1 = require("../validation/pages");
const router = (0, express_1.Router)();
// Count endpoint
router.get('/count', async (req, res, next) => {
    try {
        const { status } = req.query;
        const query = {};
        if (status && (status === 'draft' || status === 'published'))
            query.status = status;
        const total = await Page_1.default.countDocuments(query);
        res.json({ count: total });
    }
    catch (err) {
        next(err);
    }
});
// List pages with search and filters
router.get('/', async (req, res, next) => {
    try {
        const { q, status, page = '1', limit = '20' } = req.query;
        const query = {};
        // Search by title or slug
        if (q && typeof q === 'string') {
            query.$or = [
                { 'en.title': { $regex: q, $options: 'i' } },
                { 'ar.title': { $regex: q, $options: 'i' } },
                { slug: { $regex: q, $options: 'i' } },
            ];
        }
        // Filter by status
        if (status && (status === 'draft' || status === 'published')) {
            query.status = status;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const total = await Page_1.default.countDocuments(query);
        const items = await Page_1.default.find(query)
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select('slug status en.title ar.title updatedAt createdAt')
            .lean();
        res.json({
            items,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    }
    catch (err) {
        next(err);
    }
});
// Get page by ID
router.get('/:id', async (req, res, next) => {
    try {
        const page = await Page_1.default.findById(req.params.id).lean();
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    }
    catch (err) {
        next(err);
    }
});
// Get page by slug (public endpoint, supports nested slugs with custom regex)
router.get(/^\/slug\/(.+)$/, async (req, res, next) => {
    try {
        // Extract everything after /slug/ using regex capture group
        const rawSlug = req.params[0] || '';
        const normalized = rawSlug.startsWith('/') ? rawSlug : `/${rawSlug}`;
        const slug = normalized.replace(/\/{2,}/g, '/');
        const page = await Page_1.default.findOne({ slug, status: 'published' }).lean();
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    }
    catch (err) {
        next(err);
    }
});
// Create page
router.post('/', async (req, res, next) => {
    try {
        const validated = pages_1.PageCreateSchema.parse(req.body);
        // Check slug uniqueness
        const existing = await Page_1.default.findOne({ slug: validated.slug });
        if (existing) {
            return res.status(400).json({ error: 'Slug already exists' });
        }
        const page = await Page_1.default.create(validated);
        res.status(201).json(page);
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation failed', details: err.errors });
        }
        next(err);
    }
});
// Update page
router.put('/:id', async (req, res, next) => {
    try {
        const validated = pages_1.PageUpdateSchema.parse(req.body);
        // Check slug uniqueness if slug is being updated
        if (validated.slug) {
            const existing = await Page_1.default.findOne({ slug: validated.slug, _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({ error: 'Slug already exists' });
            }
        }
        const page = await Page_1.default.findByIdAndUpdate(req.params.id, validated, { new: true, runValidators: true });
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json(page);
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation failed', details: err.errors });
        }
        next(err);
    }
});
// Delete page
router.delete('/:id', async (req, res, next) => {
    try {
        const page = await Page_1.default.findByIdAndDelete(req.params.id);
        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }
        res.json({ message: 'Page deleted successfully' });
    }
    catch (err) {
        next(err);
    }
});
// Check slug availability
router.post('/check-slug', async (req, res, next) => {
    try {
        const { slug, excludeId } = req.body;
        const query = { slug };
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        const existing = await Page_1.default.findOne(query);
        res.json({ available: !existing });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
