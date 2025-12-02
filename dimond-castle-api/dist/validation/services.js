"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesUpsertSchema = void 0;
const zod_1 = require("zod");
const servicesItemSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    labelEN: zod_1.z.string().min(1),
    labelAR: zod_1.z.string().min(1),
    imagePublicId: zod_1.z.string().optional(),
});
exports.servicesUpsertSchema = zod_1.z.object({
    headingEN: zod_1.z.string().min(1),
    headingAR: zod_1.z.string().min(1),
    sectorsTitleEN: zod_1.z.string().min(1),
    sectorsTitleAR: zod_1.z.string().min(1),
    transportTitleEN: zod_1.z.string().min(1),
    transportTitleAR: zod_1.z.string().min(1),
    sectors: zod_1.z.array(servicesItemSchema),
    transport: zod_1.z.array(servicesItemSchema),
});
