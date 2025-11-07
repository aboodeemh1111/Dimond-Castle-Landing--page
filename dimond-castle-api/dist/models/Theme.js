"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ThemeSchema = new mongoose_1.Schema({
    brand: {
        primaryColor: { type: String, required: true, default: '#2C5E47' },
        secondaryColor: { type: String, required: true, default: '#1a3a2e' },
        accentColor: { type: String, required: true, default: '#D4AF37' },
        backgroundColor: { type: String, required: true, default: '#FFFFFF' },
        surfaceColor: { type: String, required: true, default: '#F9FAFB' },
    },
    typography: {
        fontFamilyEN: { type: String, required: true, default: 'Inter' },
        fontFamilyAR: { type: String, required: true, default: 'Tajawal' },
        baseFontSize: { type: Number, required: true, default: 16, min: 14, max: 18 },
        headingWeight: { type: Number, required: true, default: 700, min: 500, max: 900 },
        bodyWeight: { type: Number, required: true, default: 400, min: 300, max: 700 },
    },
    globalAssets: {
        logoLightId: String,
        logoDarkId: String,
        faviconId: String,
        socialPreviewId: String,
    },
    designTokens: {
        borderRadius: {
            type: String,
            enum: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'],
            default: 'lg',
        },
        spacingScale: {
            type: String,
            enum: ['tight', 'normal', 'spacious'],
            default: 'normal',
        },
        shadowLevel: {
            type: String,
            enum: ['none', 'soft', 'base', 'strong'],
            default: 'base',
        },
    },
    updatedBy: String,
}, { timestamps: true });
// Ensure only one theme document exists
ThemeSchema.index({}, { unique: true });
exports.default = mongoose_1.models.Theme || (0, mongoose_1.model)('Theme', ThemeSchema);
