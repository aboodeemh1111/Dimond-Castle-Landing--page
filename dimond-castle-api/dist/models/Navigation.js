"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NavItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    labelEN: { type: String, required: true },
    labelAR: { type: String, required: true },
    href: { type: String, required: true },
    type: { type: String, enum: ['internal', 'external'], required: true },
    visible: { type: Boolean, default: true },
    newTab: { type: Boolean, default: false },
    children: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
}, { _id: false });
const NavigationSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, index: true },
    items: { type: [NavItemSchema], default: [] },
}, { timestamps: true });
exports.default = mongoose_1.models.Navigation || (0, mongoose_1.model)('Navigation', NavigationSchema);
