"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ContactMessageSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    seen: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.default = mongoose_1.models.ContactMessage || (0, mongoose_1.model)('ContactMessage', ContactMessageSchema);
