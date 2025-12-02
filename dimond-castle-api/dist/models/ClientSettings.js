"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ClientSchema = new mongoose_1.Schema({
    nameEN: { type: String, required: true },
    nameAR: { type: String, required: true },
    logoPublicId: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    website: { type: String, default: '' },
    order: { type: Number, default: 0 },
    bgColor: { type: String, default: '' },
}, { _id: true });
const ClientSettingsSchema = new mongoose_1.Schema({
    clients: { type: [ClientSchema], default: [] },
    enabled: { type: Boolean, default: true },
    updatedBy: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.models.ClientSettings || (0, mongoose_1.model)('ClientSettings', ClientSettingsSchema);
