"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VisionCardSchema = new mongoose_1.Schema({
    titleEN: String,
    titleAR: String,
    bodyEN: String,
    bodyAR: String,
    icon: String,
}, { _id: false });
const VisionSettingsSchema = new mongoose_1.Schema({
    headingEN: String,
    headingAR: String,
    preambleEN: String,
    preambleAR: String,
    cards: { type: [VisionCardSchema], default: [] },
    updatedBy: String,
}, { timestamps: true });
exports.default = mongoose_1.models.VisionSettings || (0, mongoose_1.model)('VisionSettings', VisionSettingsSchema);
