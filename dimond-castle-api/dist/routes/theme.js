"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Theme_1 = __importDefault(require("../models/Theme"));
const theme_1 = require("../validation/theme");
const router = (0, express_1.Router)();
// Get current theme (public endpoint)
router.get('/', async (req, res, next) => {
    try {
        let theme = await Theme_1.default.findOne().lean();
        // If no theme exists, create default
        if (!theme) {
            theme = await Theme_1.default.create(theme_1.DEFAULT_THEME);
        }
        res.json(theme);
    }
    catch (err) {
        next(err);
    }
});
// Update theme
router.put('/', async (req, res, next) => {
    try {
        const validated = theme_1.ThemeUpdateSchema.parse(req.body);
        let theme = await Theme_1.default.findOne();
        if (!theme) {
            // Create new theme with defaults + updates
            theme = await Theme_1.default.create({ ...theme_1.DEFAULT_THEME, ...validated });
        }
        else {
            // Update existing theme
            Object.assign(theme, validated);
            await theme.save();
        }
        res.json(theme);
    }
    catch (err) {
        if (err.name === 'ZodError') {
            return res.status(400).json({ error: 'Validation failed', details: err.errors });
        }
        next(err);
    }
});
// Reset to default theme
router.post('/reset', async (req, res, next) => {
    try {
        let theme = await Theme_1.default.findOne();
        if (!theme) {
            theme = await Theme_1.default.create(theme_1.DEFAULT_THEME);
        }
        else {
            Object.assign(theme, theme_1.DEFAULT_THEME);
            await theme.save();
        }
        res.json(theme);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
