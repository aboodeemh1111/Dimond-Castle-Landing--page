"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CtaSchema = new mongoose_1.Schema({
    labelEN: { type: String, default: '' },
    labelAR: { type: String, default: '' },
    href: { type: String, default: '' },
}, { _id: false });
const HeroSettingsSchema = new mongoose_1.Schema({
    titleLeadingEN: { type: String, default: '' },
    titleLeadingAR: { type: String, default: '' },
    titleTrailingEN: { type: String, default: '' },
    titleTrailingAR: { type: String, default: '' },
    subtitleEN: { type: String, default: '' },
    subtitleAR: { type: String, default: '' },
    primaryCta: { type: CtaSchema, default: {} },
    secondaryCta: { type: CtaSchema, default: {} },
    scrollLabelEN: { type: String, default: '' },
    scrollLabelAR: { type: String, default: '' },
    backgroundImagePublicId: { type: String, default: '' },
    overlayGradientStart: { type: String, default: 'rgba(46,94,78,0.85)' },
    overlayGradientEnd: { type: String, default: 'rgba(212,175,55,0.35)' },
    highlightOverlay: {
        type: String,
        default: 'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.25), transparent)',
    },
    radialOverlayEnabled: { type: Boolean, default: true },
    updatedBy: String,
}, { timestamps: true });
exports.default = mongoose_1.models.HeroSettings || (0, mongoose_1.model)('HeroSettings', HeroSettingsSchema);
