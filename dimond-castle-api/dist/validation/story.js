"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storySettingsSchema = void 0;
const zod_1 = require("zod");
exports.storySettingsSchema = zod_1.z.object({
    badgeEN: zod_1.z.string().optional(),
    badgeAR: zod_1.z.string().optional(),
    headingEN: zod_1.z.string().optional(),
    headingAR: zod_1.z.string().optional(),
    introEN: zod_1.z.string().optional(),
    introAR: zod_1.z.string().optional(),
    bulletsEN: zod_1.z.array(zod_1.z.string()).optional(),
    bulletsAR: zod_1.z.array(zod_1.z.string()).optional(),
    imagePublicId: zod_1.z.string().optional(),
    imageAltEN: zod_1.z.string().optional(),
    imageAltAR: zod_1.z.string().optional(),
    updatedBy: zod_1.z.string().optional(),
});
