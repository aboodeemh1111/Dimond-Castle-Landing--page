"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BlogPost_1 = __importDefault(require("../models/BlogPost"));
const Page_1 = __importDefault(require("../models/Page"));
const Theme_1 = __importDefault(require("../models/Theme"));
const Navigation_1 = __importDefault(require("../models/Navigation"));
const router = (0, express_1.Router)();
router.get('/recent', async (req, res, next) => {
    try {
        const limit = Math.min(Number(req.query.limit || '20'), 50);
        const [blogs, pages, theme, nav] = await Promise.all([
            BlogPost_1.default.find().sort({ updatedAt: -1 }).limit(limit).select('en.title updatedAt').lean(),
            Page_1.default.find().sort({ updatedAt: -1 }).limit(limit).select('en.title updatedAt').lean(),
            Theme_1.default.findOne().select('updatedAt').lean(),
            Navigation_1.default.find().sort({ updatedAt: -1 }).limit(1).select('name updatedAt').lean(),
        ]);
        const items = [];
        items.push(...blogs.map((b) => ({ type: 'blog', title: b.en?.title || 'Untitled', updatedAt: b.updatedAt })));
        items.push(...pages.map((p) => ({ type: 'page', title: p.en?.title || 'Untitled', updatedAt: p.updatedAt })));
        if (theme)
            items.push({ type: 'theme', title: 'Theme', updatedAt: theme.updatedAt });
        if (nav && nav[0])
            items.push({ type: 'navigation', title: `Navigation: ${nav[0].name}`, updatedAt: nav[0].updatedAt });
        items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        res.json({ items: items.slice(0, limit) });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
