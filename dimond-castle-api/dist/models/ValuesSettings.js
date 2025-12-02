"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ValueCardSchema = new mongoose_1.Schema({
    titleEN: String,
    titleAR: String,
    bodyEN: String,
    bodyAR: String,
    icon: String,
}, { _id: false });
const ValuesSettingsSchema = new mongoose_1.Schema({
    headingEN: String,
    headingAR: String,
    items: { type: [ValueCardSchema], default: [] },
    updatedBy: String,
}, { timestamps: true });
exports.default = mongoose_1.models.ValuesSettings || (0, mongoose_1.model)('ValuesSettings', ValuesSettingsSchema);
