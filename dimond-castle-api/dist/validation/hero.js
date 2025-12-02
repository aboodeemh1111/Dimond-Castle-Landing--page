"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroSettingsSchema = void 0;
const zod_1 = require("zod");
const ctaSchema = zod_1.z.object({
    labelEN: zod_1.z.string().optional(),
    labelAR: zod_1.z.string().optional(),
    href: zod_1.z.string().optional(),
});
exports.heroSettingsSchema = zod_1.z.object({
    titleLeadingEN: zod_1.z.string().optional(),
    titleLeadingAR: zod_1.z.string().optional(),
    titleTrailingEN: zod_1.z.string().optional(),
    titleTrailingAR: zod_1.z.string().optional(),
    subtitleEN: zod_1.z.string().optional(),
    subtitleAR: zod_1.z.string().optional(),
    scrollLabelEN: zod_1.z.string().optional(),
    scrollLabelAR: zod_1.z.string().optional(),
    primaryCta: ctaSchema.optional(),
    secondaryCta: ctaSchema.optional(),
    backgroundImagePublicId: zod_1.z.string().optional(),
    overlayGradientStart: zod_1.z.string().optional(),
    overlayGradientEnd: zod_1.z.string().optional(),
    highlightOverlay: zod_1.z.string().optional(),
    radialOverlayEnabled: zod_1.z.boolean().optional(),
    updatedBy: zod_1.z.string().optional(),
});
