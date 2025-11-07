"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Settings_1 = __importDefault(require("../models/Settings"));
const settings_1 = require("../validation/settings");
const Theme_1 = __importDefault(require("../models/Theme"));
const Navigation_1 = __importDefault(require("../models/Navigation"));
const Page_1 = __importDefault(require("../models/Page"));
const BlogPost_1 = __importDefault(require("../models/BlogPost"));
const ContactMessage_1 = __importDefault(require("../models/ContactMessage"));
const router = (0, express_1.Router)();
// Get settings (create default if missing)
router.get('/', async (_req, res, next) => {
    try {
        let doc = await Settings_1.default.findOne().lean();
        if (!doc) {
            const created = await Settings_1.default.create({ companyName: 'Company' });
            return res.json(created);
        }
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
// Patch settings (merge)
router.patch('/', async (req, res, next) => {
    try {
        const parsed = settings_1.settingsPatchSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const update = parsed.data;
        const doc = await Settings_1.default.findOneAndUpdate({}, update, { new: true, upsert: true });
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
// Exports
router.get('/export/pages', async (_req, res, next) => {
    try {
        const items = await Page_1.default.find().lean();
        res.json({ items });
    }
    catch (err) {
        next(err);
    }
});
router.get('/export/blogs', async (_req, res, next) => {
    try {
        const items = await BlogPost_1.default.find().lean();
        res.json({ items });
    }
    catch (err) {
        next(err);
    }
});
router.get('/export/config', async (_req, res, next) => {
    try {
        const [settings, theme, nav] = await Promise.all([
            Settings_1.default.findOne().lean(),
            Theme_1.default.findOne().lean(),
            Navigation_1.default.find().lean(),
        ]);
        res.json({ settings, theme, navigation: nav });
    }
    catch (err) {
        next(err);
    }
});
router.get('/export/all', async (_req, res, next) => {
    try {
        const [settings, theme, nav, pages, blogs] = await Promise.all([
            Settings_1.default.findOne().lean(),
            Theme_1.default.findOne().lean(),
            Navigation_1.default.find().lean(),
            Page_1.default.find().lean(),
            BlogPost_1.default.find().lean(),
        ]);
        res.json({ settings, theme, navigation: nav, pages, blogs });
    }
    catch (err) {
        next(err);
    }
});
// Danger zone actions
router.post('/danger/clear-drafts', async (_req, res, next) => {
    try {
        const posts = await BlogPost_1.default.deleteMany({ status: 'draft' });
        const pages = await Page_1.default.deleteMany({ status: 'draft' });
        res.json({ ok: true, deleted: { blogDrafts: posts.deletedCount, pageDrafts: pages.deletedCount } });
    }
    catch (err) {
        next(err);
    }
});
router.post('/danger/clear-messages', async (_req, res, next) => {
    try {
        const result = await ContactMessage_1.default.deleteMany({});
        res.json({ ok: true, deleted: result.deletedCount });
    }
    catch (err) {
        next(err);
    }
});
router.post('/danger/reset-settings', async (_req, res, next) => {
    try {
        await Settings_1.default.deleteMany({});
        const created = await Settings_1.default.create({ companyName: 'Company' });
        res.json({ ok: true, settings: created });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
