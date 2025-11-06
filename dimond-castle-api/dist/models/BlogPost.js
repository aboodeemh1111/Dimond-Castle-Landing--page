"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LocaleContentSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    excerpt: { type: String },
    blocks: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    seo: {
        title: String,
        description: String,
    },
}, { _id: false });
const BlogPostSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    coverPublicId: String,
    tags: { type: [String], default: [] },
    author: String,
    publishAt: Date,
    en: { type: LocaleContentSchema, required: true },
    ar: { type: LocaleContentSchema, required: true },
}, { timestamps: true });
exports.default = mongoose_1.models.BlogPost || (0, mongoose_1.model)('BlogPost', BlogPostSchema);
