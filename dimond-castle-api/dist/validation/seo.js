"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seoSettingsPatchSchema = void 0;
const zod_1 = require("zod");
const localizedSeoSchema = zod_1.z.object({
    siteTitle: zod_1.z.string().optional(),
    siteDescription: zod_1.z.string().optional(),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.seoSettingsPatchSchema = zod_1.z.object({
    en: localizedSeoSchema.optional(),
    ar: localizedSeoSchema.optional(),
    siteName: zod_1.z.string().optional(),
    titleSeparator: zod_1.z.string().optional(),
    logoPublicId: zod_1.z.string().optional(),
    ogImagePublicId: zod_1.z.string().optional(),
    canonicalDomain: zod_1.z.string().optional(),
    robotsIndex: zod_1.z.boolean().optional(),
    robotsFollow: zod_1.z.boolean().optional(),
    twitterHandle: zod_1.z.string().optional(),
    facebookAppId: zod_1.z.string().optional(),
    googleSiteVerification: zod_1.z.string().optional(),
    bingSiteVerification: zod_1.z.string().optional(),
    googleAnalyticsId: zod_1.z.string().optional(),
    googleTagManagerId: zod_1.z.string().optional(),
});
