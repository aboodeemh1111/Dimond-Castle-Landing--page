"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const ADMIN_USER = process.env.ADMIN_USER || 'diamond';
const ADMIN_PASS = process.env.ADMIN_PASS || 'pass123123';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change';
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Missing credentials' });
    if (username !== ADMIN_USER || password !== ADMIN_PASS)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = jsonwebtoken_1.default.sign({ sub: ADMIN_USER, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { username: ADMIN_USER } });
});
router.get('/me', (req, res) => {
    try {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.substring(7) : '';
        if (!token)
            return res.status(401).json({ error: 'Unauthorized' });
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({ user: { username: payload.sub } });
    }
    catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
});
exports.default = router;
