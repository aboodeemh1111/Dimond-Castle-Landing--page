"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ContactSettings_1 = __importDefault(require("../models/ContactSettings"));
const ContactMessage_1 = __importDefault(require("../models/ContactMessage"));
const contact_1 = require("../validation/contact");
const router = (0, express_1.Router)();
// Settings: get
router.get('/settings', async (_req, res, next) => {
    try {
        let settings = await ContactSettings_1.default.findOne().sort({ updatedAt: -1 });
        if (!settings) {
            // return an empty doc shape for easier first-load UX
            return res.json({
                titleEN: '',
                titleAR: '',
                subtitleEN: '',
                subtitleAR: '',
                businessHours: [],
                phoneNumbers: [],
                whatsappNumbers: [],
                emails: [],
                addressesEN: [],
                addressesAR: [],
                socialLinks: {},
                updatedAt: new Date().toISOString(),
            });
        }
        res.json(settings);
    }
    catch (err) {
        next(err);
    }
});
// Settings: upsert (replace)
router.put('/settings', async (req, res, next) => {
    try {
        const parsed = contact_1.contactSettingsSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const payload = parsed.data;
        const saved = await ContactSettings_1.default.findOneAndUpdate({}, payload, { new: true, upsert: true });
        res.json(saved);
    }
    catch (err) {
        next(err);
    }
});
// Public create message
router.post('/', async (req, res, next) => {
    try {
        const parsed = contact_1.contactMessageCreateSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const created = await ContactMessage_1.default.create({ ...parsed.data, submittedAt: new Date() });
        res.status(201).json({ ok: true, id: created._id });
    }
    catch (err) {
        next(err);
    }
});
// Admin: list messages
router.get('/messages', async (req, res, next) => {
    try {
        const parsed = contact_1.messageListQuerySchema.safeParse(req.query);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.flatten() });
        const { q, status, page, limit } = parsed.data;
        const filter = {};
        if (q) {
            filter.$or = [
                { name: new RegExp(q, 'i') },
                { email: new RegExp(q, 'i') },
                { phone: new RegExp(q, 'i') },
                { message: new RegExp(q, 'i') },
            ];
        }
        if (status && status !== 'all') {
            if (status === 'unseen')
                filter.seen = false;
            if (status === 'resolved')
                filter.resolved = true;
            if (status === 'unresolved')
                filter.resolved = { $ne: true };
        }
        const total = await ContactMessage_1.default.countDocuments(filter);
        const items = await ContactMessage_1.default.find(filter)
            .sort({ submittedAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    }
    catch (err) {
        next(err);
    }
});
// Admin: messages count (optional range like 7d)
router.get('/messages/count', async (req, res, next) => {
    try {
        const { range } = req.query;
        const filter = {};
        if (range && typeof range === 'string' && /^(\d+)d$/.test(range)) {
            const days = Number(range.replace('d', ''));
            const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            filter.submittedAt = { $gte: since };
        }
        const count = await ContactMessage_1.default.countDocuments(filter);
        res.json({ count });
    }
    catch (err) {
        next(err);
    }
});
// Admin: update message flags
router.patch('/messages/:id', async (req, res, next) => {
    try {
        const { seen, resolved } = req.body;
        const updated = await ContactMessage_1.default.findByIdAndUpdate(req.params.id, { $set: { ...(seen != null ? { seen } : {}), ...(resolved != null ? { resolved } : {}) } }, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    }
    catch (err) {
        next(err);
    }
});
// Admin: delete message
router.delete('/messages/:id', async (req, res, next) => {
    try {
        await ContactMessage_1.default.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
