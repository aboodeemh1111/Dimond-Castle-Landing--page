"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const blogs_1 = __importDefault(require("./routes/blogs"));
const pages_1 = __importDefault(require("./routes/pages"));
const media_1 = __importDefault(require("./routes/media"));
const theme_1 = __importDefault(require("./routes/theme"));
const navigation_1 = __importDefault(require("./routes/navigation"));
const contact_1 = __importDefault(require("./routes/contact"));
const activity_1 = __importDefault(require("./routes/activity"));
const settings_1 = __importDefault(require("./routes/settings"));
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const services_1 = __importDefault(require("./routes/services"));
const hero_1 = __importDefault(require("./routes/hero"));
const story_1 = __importDefault(require("./routes/story"));
const vision_1 = __importDefault(require("./routes/vision"));
const values_1 = __importDefault(require("./routes/values"));
const clients_1 = __importDefault(require("./routes/clients"));
const seo_1 = __importDefault(require("./routes/seo"));
const app = (0, express_1.default)();
// Configure Helmet with relaxed cross-origin policies for images
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS configuration - allow all origins in development
app.use((0, cors_1.default)({
    origin: env_1.env.FRONTEND_ORIGINS ? env_1.env.FRONTEND_ORIGINS.split(',') : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json({ limit: '2mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, express_rate_limit_1.default)({ windowMs: 60000, max: 300 }));
// Serve static files from uploads directory (allow embedding on other origins)
app.use('/uploads', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
}, express_1.default.static(env_1.env.UPLOAD_DIR));
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/blogs', blogs_1.default);
app.use('/api/pages', pages_1.default);
app.use('/api/media', media_1.default);
app.use('/api/theme', theme_1.default);
app.use('/api/navigation', navigation_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/activity', activity_1.default);
app.use('/api/settings', settings_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/services', services_1.default);
app.use('/api/hero', hero_1.default);
app.use('/api/story', story_1.default);
app.use('/api/vision', vision_1.default);
app.use('/api/values', values_1.default);
app.use('/api/clients', clients_1.default);
app.use('/api/seo', seo_1.default);
// Not found handler
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
exports.default = app;
