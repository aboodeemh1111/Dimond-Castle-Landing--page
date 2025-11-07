"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_THEME = exports.ThemeUpdateSchema = exports.ThemeSchema = void 0;
const zod_1 = require("zod");
// HEX color validation
const hexColorSchema = zod_1.z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid HEX color (e.g., #2C5E47)');
// Safe font lists
const safeENFonts = ['Inter', 'Work Sans', 'Montserrat', 'Roboto', 'Open Sans', 'Lato'];
const safeARFonts = ['Tajawal', 'Cairo', 'IBM Plex Arabic', 'Almarai', 'Noto Sans Arabic'];
exports.ThemeSchema = zod_1.z.object({
    brand: zod_1.z.object({
        primaryColor: hexColorSchema,
        secondaryColor: hexColorSchema,
        accentColor: hexColorSchema,
        backgroundColor: hexColorSchema,
        surfaceColor: hexColorSchema,
    }),
    typography: zod_1.z.object({
        fontFamilyEN: zod_1.z.enum(safeENFonts),
        fontFamilyAR: zod_1.z.enum(safeARFonts),
        baseFontSize: zod_1.z.number().int().min(14).max(18),
        headingWeight: zod_1.z.number().int().min(500).max(900).multipleOf(100),
        bodyWeight: zod_1.z.number().int().min(300).max(700).multipleOf(100),
    }),
    globalAssets: zod_1.z.object({
        logoLightId: zod_1.z.string().optional(),
        logoDarkId: zod_1.z.string().optional(),
        faviconId: zod_1.z.string().optional(),
        socialPreviewId: zod_1.z.string().optional(),
    }),
    designTokens: zod_1.z.object({
        borderRadius: zod_1.z.enum(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
        spacingScale: zod_1.z.enum(['tight', 'normal', 'spacious']),
        shadowLevel: zod_1.z.enum(['none', 'soft', 'base', 'strong']),
    }),
    updatedBy: zod_1.z.string().optional(),
});
exports.ThemeUpdateSchema = exports.ThemeSchema.partial();
// Default theme values
exports.DEFAULT_THEME = {
    brand: {
        primaryColor: '#2C5E47',
        secondaryColor: '#1a3a2e',
        accentColor: '#D4AF37',
        backgroundColor: '#FFFFFF',
        surfaceColor: '#F9FAFB',
    },
    typography: {
        fontFamilyEN: 'Inter',
        fontFamilyAR: 'Tajawal',
        baseFontSize: 16,
        headingWeight: 700,
        bodyWeight: 400,
    },
    globalAssets: {},
    designTokens: {
        borderRadius: 'lg',
        spacingScale: 'normal',
        shadowLevel: 'base',
    },
};
