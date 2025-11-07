"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cloudinary_1 = require("../config/cloudinary");
const env_1 = require("../config/env");
const BlogPost_1 = __importDefault(require("../models/BlogPost"));
const Page_1 = __importDefault(require("../models/Page"));
const router = (0, express_1.Router)();
// Count assets (images + videos)
router.get('/count', async (_req, res, next) => {
    try {
        if (!cloudinary_1.cloudinary.config().cloud_name) {
            return res.json({ count: 0 });
        }
        const result = await cloudinary_1.cloudinary.search
            .expression('resource_type:image OR resource_type:video')
            .max_results(1)
            .execute();
        res.json({ count: result.total_count || 0 });
    }
    catch (e) {
        // Return 0 if Cloudinary is not configured
        res.json({ count: 0 });
    }
});
// Get signed upload parameters
router.post('/signature', async (req, res, next) => {
    try {
        const { folder = '', public_id, resource_type = 'auto', eager, tags } = req.body || {};
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = {
            timestamp,
            folder,
        };
        if (public_id)
            paramsToSign.public_id = public_id;
        if (eager)
            paramsToSign.eager = eager;
        if (tags)
            paramsToSign.tags = tags;
        // Extract cloud name from config (supports both CLOUDINARY_URL and explicit vars)
        let cloudName = env_1.env.CLOUDINARY_CLOUD_NAME;
        let apiKey = env_1.env.CLOUDINARY_API_KEY;
        let apiSecret = env_1.env.CLOUDINARY_API_SECRET;
        if (!cloudName && env_1.env.CLOUDINARY_URL) {
            // Parse cloudinary://API_KEY:API_SECRET@CLOUD_NAME
            const match = env_1.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
            if (match) {
                apiKey = match[1];
                apiSecret = match[2];
                cloudName = match[3];
            }
        }
        const signature = cloudinary_1.cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
        res.json({
            timestamp,
            signature,
            apiKey,
            cloudName,
            folder,
            resource_type,
        });
    }
    catch (e) {
        next(e);
    }
});
// Usage check for a given public_id
router.get('/usage', async (req, res, next) => {
    try {
        const { publicId } = req.query;
        if (!publicId)
            return res.status(400).json({ error: 'publicId is required' });
        const coverCount = await BlogPost_1.default.countDocuments({ coverPublicId: publicId });
        const blocksCount = await BlogPost_1.default.countDocuments({
            $or: [
                { 'en.blocks': { $elemMatch: { publicId } } },
                { 'ar.blocks': { $elemMatch: { publicId } } },
                { 'en.blocks': { $elemMatch: { posterId: publicId } } },
                { 'ar.blocks': { $elemMatch: { posterId: publicId } } },
            ],
        });
        const posts = await BlogPost_1.default.find({
            $or: [
                { coverPublicId: publicId },
                { 'en.blocks': { $elemMatch: { publicId } } },
                { 'ar.blocks': { $elemMatch: { publicId } } },
                { 'en.blocks': { $elemMatch: { posterId: publicId } } },
                { 'ar.blocks': { $elemMatch: { posterId: publicId } } },
            ],
        }).select({ _id: 1, slug: 1, 'en.title': 1 }).limit(50);
        // Basic pages usage check: look for ogImageId fields
        const pagesCount = await Page_1.default.countDocuments({
            $or: [
                { 'en.seo.ogImageId': publicId },
                { 'ar.seo.ogImageId': publicId },
            ],
        });
        res.json({
            blog: { coverCount, blocksCount, total: Math.max(coverCount, 0) + Math.max(blocksCount, 0), posts },
            pages: { total: pagesCount },
        });
    }
    catch (e) {
        next(e);
    }
});
// List media (images/videos) via Cloudinary Search API
router.get('/', async (req, res, next) => {
    try {
        const { q = '', type = 'all', page = '1', max_results = '30', folder } = req.query;
        const expressions = [];
        if (type === 'image')
            expressions.push('resource_type:image');
        if (type === 'video')
            expressions.push('resource_type:video');
        if (folder)
            expressions.push(`folder:${folder}`);
        if (q)
            expressions.push(`public_id:${q}* OR tags=${q}* OR context.alt:${q}* OR context.caption:${q}*`);
        const expression = expressions.length ? expressions.join(' AND ') : '';
        const search = cloudinary_1.cloudinary.search
            .expression(expression || 'resource_type:image OR resource_type:video')
            .sort_by('created_at', 'desc')
            .max_results(Number(max_results));
        const result = await search.execute();
        res.json({ items: result.resources, total_count: result.total_count, next_cursor: result.next_cursor });
    }
    catch (e) {
        next(e);
    }
});
// Delete a media asset by public_id
router.delete('/:publicId', async (req, res, next) => {
    try {
        const { publicId } = req.params;
        // Attempt to delete as image first, fallback to video
        const img = await cloudinary_1.cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        if (img.result === 'not found') {
            const vid = await cloudinary_1.cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
            return res.json(vid);
        }
        res.json(img);
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
