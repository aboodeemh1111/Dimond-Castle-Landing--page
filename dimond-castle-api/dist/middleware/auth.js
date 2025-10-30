import jwt from "jsonwebtoken";
import { config } from "../config/env";
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header)
        return res.status(401).json({ error: "Missing Authorization header" });
    const token = header.replace(/^Bearer\s+/i, "");
    try {
        const payload = jwt.verify(token, config.jwtSecret);
        req.user = payload;
        return next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ error: "Unauthorized" });
        if (req.user.role !== role)
            return res.status(403).json({ error: "Forbidden" });
        return next();
    };
}
