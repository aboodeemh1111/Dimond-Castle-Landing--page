"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valuesSettingsSchema = exports.visionSettingsSchema = void 0;
const zod_1 = require("zod");
const cardSchema = zod_1.z.object({
    titleEN: zod_1.z.string().optional(),
    titleAR: zod_1.z.string().optional(),
    bodyEN: zod_1.z.string().optional(),
    bodyAR: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.visionSettingsSchema = zod_1.z.object({
    headingEN: zod_1.z.string().optional(),
    headingAR: zod_1.z.string().optional(),
    preambleEN: zod_1.z.string().optional(),
    preambleAR: zod_1.z.string().optional(),
    cards: zod_1.z.array(cardSchema).optional(),
    updatedBy: zod_1.z.string().optional(),
});
exports.valuesSettingsSchema = zod_1.z.object({
    headingEN: zod_1.z.string().optional(),
    headingAR: zod_1.z.string().optional(),
    items: zod_1.z.array(cardSchema).optional(),
    updatedBy: zod_1.z.string().optional(),
});
