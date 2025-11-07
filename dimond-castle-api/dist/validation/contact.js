"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageListQuerySchema = exports.contactMessageCreateSchema = exports.contactSettingsSchema = exports.socialLinksSchema = void 0;
const zod_1 = require("zod");
exports.socialLinksSchema = zod_1.z.object({
    facebook: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    instagram: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    twitter: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    linkedin: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    tiktok: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    youtube: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
}).partial();
exports.contactSettingsSchema = zod_1.z.object({
    titleEN: zod_1.z.string().min(1),
    titleAR: zod_1.z.string().min(1),
    subtitleEN: zod_1.z.string().optional(),
    subtitleAR: zod_1.z.string().optional(),
    businessHours: zod_1.z.array(zod_1.z.string()).default([]),
    phoneNumbers: zod_1.z.array(zod_1.z.string()).default([]),
    whatsappNumbers: zod_1.z.array(zod_1.z.string()).default([]),
    emails: zod_1.z.array(zod_1.z.string().email().or(zod_1.z.string().min(3))).default([]),
    addressesEN: zod_1.z.array(zod_1.z.string()).default([]),
    addressesAR: zod_1.z.array(zod_1.z.string()).default([]),
    googleMapEmbedUrl: zod_1.z.string().url().optional(),
    socialLinks: exports.socialLinksSchema.optional(),
    contactPageHeroImageId: zod_1.z.string().optional(),
    updatedBy: zod_1.z.string().optional(),
});
exports.contactMessageCreateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    message: zod_1.z.string().min(1),
});
exports.messageListQuerySchema = zod_1.z.object({
    q: zod_1.z.string().optional(),
    status: zod_1.z.enum(['all', 'unseen', 'resolved', 'unresolved']).optional(),
    page: zod_1.z.coerce.number().int().min(1).default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).default(20),
});
