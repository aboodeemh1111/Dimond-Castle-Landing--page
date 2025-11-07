"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsPatchSchema = void 0;
const zod_1 = require("zod");
exports.settingsPatchSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1).optional(),
    companyCode: zod_1.z.string().optional(),
    timeFormat: zod_1.z.enum(['24h', 'ampm']).optional(),
    timezone: zod_1.z.string().optional(),
    defaultPhoneCountryCode: zod_1.z.string().optional(),
    localization: zod_1.z
        .object({
        supportedLanguages: zod_1.z.array(zod_1.z.enum(['en', 'ar'])).optional(),
        defaultLanguage: zod_1.z.enum(['en', 'ar']).optional(),
        fallbackStrategy: zod_1.z.enum(['en_if_missing', 'ar_if_missing', 'hide_if_missing']).optional(),
    })
        .optional(),
    seo: zod_1.z
        .object({
        titleSuffix: zod_1.z.string().optional(),
        descriptionEN: zod_1.z.string().optional(),
        descriptionAR: zod_1.z.string().optional(),
        ogImagePublicId: zod_1.z.string().optional(),
        robotsIndex: zod_1.z.boolean().optional(),
        indexDrafts: zod_1.z.boolean().optional(),
        canonicalDomain: zod_1.z.string().url().optional(),
    })
        .optional(),
    adminEmail: zod_1.z.string().email().optional(),
    integrations: zod_1.z
        .object({
        cloudinaryCloudName: zod_1.z.string().optional(),
        cloudinaryFolderPrefix: zod_1.z.string().optional(),
        gaMeasurementId: zod_1.z.string().regex(/^G-[A-Z0-9]+$/).optional(),
        gtmId: zod_1.z.string().regex(/^GTM-[A-Z0-9]+$/).optional(),
        gscPropertyId: zod_1.z.string().optional(),
        recaptchaSiteKey: zod_1.z.string().optional(),
    })
        .optional(),
});
