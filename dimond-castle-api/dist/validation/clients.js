"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientSettingsSchema = exports.clientSchema = void 0;
const zod_1 = require("zod");
exports.clientSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    nameEN: zod_1.z.string().min(1, 'English name is required'),
    nameAR: zod_1.z.string().min(1, 'Arabic name is required'),
    logoPublicId: zod_1.z.string().optional(),
    logoUrl: zod_1.z.string().min(1).or(zod_1.z.literal('')).optional(),
    website: zod_1.z.string().url().or(zod_1.z.literal('')).optional(),
    order: zod_1.z.number().optional(),
    bgColor: zod_1.z
        .string()
        .regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Color must be a valid hex value')
        .or(zod_1.z.literal(''))
        .optional(),
});
exports.clientSettingsSchema = zod_1.z.object({
    clients: zod_1.z.array(exports.clientSchema),
    enabled: zod_1.z.boolean().optional(),
    updatedBy: zod_1.z.string().optional(),
});
