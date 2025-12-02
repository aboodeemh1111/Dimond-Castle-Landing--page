"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HeroSettings_1 = __importDefault(require("../models/HeroSettings"));
const hero_1 = require("../validation/hero");
const router = (0, express_1.Router)();
const defaultHeroResponse = {
    titleLeadingEN: '',
    titleLeadingAR: '',
    titleTrailingEN: '',
    titleTrailingAR: '',
    subtitleEN: '',
    subtitleAR: '',
    scrollLabelEN: 'Scroll',
    scrollLabelAR: 'مرر للأسفل',
    primaryCta: {
        labelEN: '',
        labelAR: '',
        href: '#services',
    },
    secondaryCta: {
        labelEN: '',
        labelAR: '',
        href: '#about',
    },
    backgroundImagePublicId: '',
    overlayGradientStart: 'rgba(46,94,78,0.85)',
    overlayGradientEnd: 'rgba(212,175,55,0.35)',
    highlightOverlay: 'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent)',
    radialOverlayEnabled: true,
    updatedAt: new Date().toISOString(),
};
router.get('/settings', async (_req, res, next) => {
    try {
        const settings = await HeroSettings_1.default.findOne().sort({ updatedAt: -1 }).lean();
        if (!settings) {
            return res.json(defaultHeroResponse);
        }
        return res.json(settings);
    }
    catch (err) {
        return next(err);
    }
});
router.put('/settings', async (req, res, next) => {
    try {
        const parsed = hero_1.heroSettingsSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        const payload = parsed.data;
        const saved = await HeroSettings_1.default.findOneAndUpdate({}, payload, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        return res.json(saved);
    }
    catch (err) {
        return next(err);
    }
});
exports.default = router;
