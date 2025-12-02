"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const StorySettingsSchema = new mongoose_1.Schema({
    badgeEN: String,
    badgeAR: String,
    headingEN: String,
    headingAR: String,
    introEN: String,
    introAR: String,
    bulletsEN: { type: [String], default: [] },
    bulletsAR: { type: [String], default: [] },
    imagePublicId: String,
    imageAltEN: String,
    imageAltAR: String,
    updatedBy: String,
}, { timestamps: true });
exports.default = mongoose_1.models.StorySettings || (0, mongoose_1.model)('StorySettings', StorySettingsSchema);
