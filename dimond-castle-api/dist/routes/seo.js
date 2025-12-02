"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SeoSettings_1 = __importDefault(require("../models/SeoSettings"));
const seo_1 = require("../validation/seo");
const router = (0, express_1.Router)();
// Get SEO settings (create default if missing)
router.get('/', async (_req, res, next) => {
    try {
        let doc = await SeoSettings_1.default.findOne().lean();
        if (!doc) {
            const created = await SeoSettings_1.default.create({
                siteName: 'White Diamond',
                en: {
                    siteTitle: 'White Diamond',
                    siteDescription: 'Premium quality rice for discerning customers worldwide.',
                    keywords: ['rice', 'white diamond', 'premium rice'],
                },
                ar: {
                    siteTitle: 'الألماس الأبيض',
                    siteDescription: 'أرز فاخر عالي الجودة لعملائنا المميزين حول العالم.',
                    keywords: ['أرز', 'الألماس الأبيض', 'أرز فاخر'],
                },
            });
            return res.json(created);
        }
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
// Public endpoint for website to fetch SEO settings
router.get('/public', async (_req, res, next) => {
    try {
        let doc = await SeoSettings_1.default.findOne().lean();
        if (!doc) {
            // Return defaults
            return res.json({
                siteName: 'White Diamond',
                en: {
                    siteTitle: 'White Diamond',
                    siteDescription: 'Premium quality rice for discerning customers worldwide.',
                    keywords: [],
                },
                ar: {
                    siteTitle: 'الألماس الأبيض',
                    siteDescription: 'أرز فاخر عالي الجودة لعملائنا المميزين حول العالم.',
                    keywords: [],
                },
                logoPublicId: '',
                ogImagePublicId: '',
                canonicalDomain: '',
                robotsIndex: true,
                robotsFollow: true,
            });
        }
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
// Patch SEO settings (merge)
router.patch('/', async (req, res, next) => {
    try {
        const parsed = seo_1.seoSettingsPatchSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const update = parsed.data;
        // Handle nested updates properly
        const flatUpdate = {};
        for (const [key, value] of Object.entries(update)) {
            if (key === 'en' || key === 'ar') {
                // For nested objects, set each field individually to allow partial updates
                if (value && typeof value === 'object') {
                    for (const [nestedKey, nestedValue] of Object.entries(value)) {
                        if (nestedValue !== undefined) {
                            flatUpdate[`${key}.${nestedKey}`] = nestedValue;
                        }
                    }
                }
            }
            else if (value !== undefined) {
                flatUpdate[key] = value;
            }
        }
        const doc = await SeoSettings_1.default.findOneAndUpdate({}, { $set: flatUpdate }, { new: true, upsert: true });
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
