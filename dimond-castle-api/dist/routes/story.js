"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StorySettings_1 = __importDefault(require("../models/StorySettings"));
const story_1 = require("../validation/story");
const router = (0, express_1.Router)();
const defaultStory = {
    badgeEN: 'Since 2015',
    badgeAR: 'منذ 2015',
    headingEN: 'Introduction & Story',
    headingAR: 'المقدمة والقصة',
    introEN: 'We are a company established in 2015 in the rice sector within the Kingdom of Saudi Arabia, driven by a clear vision to provide high-quality rice products that meet the needs of the local market and exceed consumer expectations.',
    introAR: 'نحن شركة تأسست عام 2015 في قطاع الأرز داخل المملكة العربية السعودية، بدافع رؤية واضحة لتقديم منتجات أرز عالية الجودة تلبي احتياجات السوق المحلي وتتجاوز توقعات المستهلكين.',
    bulletsEN: [
        'Our company was founded on the belief that food is a fundamental pillar of community life, and on our commitment to contributing to the enhancement of food security in the Kingdom.',
        'Since our inception, we have focused on building strong partnerships with the world\'s best suppliers and establishing an advanced distribution network.',
        'Today, we continue to grow confidently within this sector, remaining dedicated to being a trusted company that delivers only the finest rice to consumers across Saudi Arabia.',
    ],
    bulletsAR: [
        'تأسست شركتنا على قناعة بأن الطعام ركيزة أساسية في حياة المجتمع، وعلى التزامنا بالمساهمة في تعزيز الأمن الغذائي في المملكة.',
        'منذ بدايتنا، ركزنا على بناء شراكات قوية مع أفضل المورّدين في العالم، وإنشاء شبكة توزيع متقدمة.',
        'اليوم، نواصل النمو بثقة داخل هذا القطاع، ملتزمين بأن نكون شركة موثوقة تقدم أفضل أنواع الأرز للمستهلكين في جميع أنحاء المملكة.',
    ],
    imagePublicId: '',
    imageAltEN: 'Biryani and rice feast showcasing our premium rice products',
    imageAltAR: 'وليمة برياني وأرز تعرض منتجاتنا المميزة',
};
router.get('/settings', async (_req, res, next) => {
    try {
        const settings = await StorySettings_1.default.findOne().sort({ updatedAt: -1 }).lean();
        if (!settings)
            return res.json(defaultStory);
        return res.json(settings);
    }
    catch (err) {
        return next(err);
    }
});
router.put('/settings', async (req, res, next) => {
    try {
        const parsed = story_1.storySettingsSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        const payload = parsed.data;
        const saved = await StorySettings_1.default.findOneAndUpdate({}, payload, { new: true, upsert: true, setDefaultsOnInsert: true });
        return res.json(saved);
    }
    catch (err) {
        return next(err);
    }
});
exports.default = router;
