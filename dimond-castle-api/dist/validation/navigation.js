"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationUpsertSchema = void 0;
const zod_1 = require("zod");
const navItemBase = zod_1.z.object({
    id: zod_1.z.string().min(1),
    labelEN: zod_1.z.string().min(1),
    labelAR: zod_1.z.string().min(1),
    href: zod_1.z.string().min(1),
    type: zod_1.z.enum(['internal', 'external']),
    visible: zod_1.z.boolean().optional(),
    newTab: zod_1.z.boolean().optional(),
});
const navItemSchema = navItemBase.extend({
    children: zod_1.z.lazy(() => zod_1.z.array(navItemSchema).default([])).optional(),
});
exports.NavigationUpsertSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    items: zod_1.z.array(navItemSchema).default([]),
});
