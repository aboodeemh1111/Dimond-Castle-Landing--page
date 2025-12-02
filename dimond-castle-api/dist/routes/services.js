"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Services_1 = __importDefault(require("../models/Services"));
const services_1 = require("../validation/services");
const router = (0, express_1.Router)();
// Get current services config (create with defaults if missing)
router.get('/', async (_req, res, next) => {
    try {
        let doc = await Services_1.default.findOne().lean();
        if (!doc) {
            const created = await Services_1.default.create({});
            return res.json(created);
        }
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
// Public shape (same for now, but could be narrowed later)
router.get('/public', async (_req, res, next) => {
    try {
        let doc = await Services_1.default.findOne().lean();
        if (!doc) {
            doc = (await Services_1.default.create({})).toObject();
        }
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
// Upsert full services config
router.put('/', async (req, res, next) => {
    try {
        const parsed = services_1.servicesUpsertSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        const update = parsed.data;
        const doc = await Services_1.default.findOneAndUpdate({}, update, {
            new: true,
            upsert: true,
        });
        res.json(doc);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
