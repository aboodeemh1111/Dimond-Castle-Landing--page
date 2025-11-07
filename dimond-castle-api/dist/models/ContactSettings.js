"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SocialLinksSchema = new mongoose_1.Schema({
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    tiktok: String,
    youtube: String,
}, { _id: false });
const ContactSettingsSchema = new mongoose_1.Schema({
    titleEN: String,
    titleAR: String,
    subtitleEN: String,
    subtitleAR: String,
    businessHours: { type: [String], default: [] },
    phoneNumbers: { type: [String], default: [] },
    whatsappNumbers: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    addressesEN: { type: [String], default: [] },
    addressesAR: { type: [String], default: [] },
    googleMapEmbedUrl: String,
    socialLinks: { type: SocialLinksSchema, default: {} },
    contactPageHeroImageId: String,
    updatedBy: String,
}, { timestamps: true });
exports.default = mongoose_1.models.ContactSettings || (0, mongoose_1.model)('ContactSettings', ContactSettingsSchema);
