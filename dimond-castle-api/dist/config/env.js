import dotenv from "dotenv";
dotenv.config();
function getEnv(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
export const config = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 4000),
    mongoUri: getEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/dimond_castle"),
    jwtSecret: getEnv("JWT_SECRET", "change-me-in-prod"),
    uploadDir: getEnv("UPLOAD_DIR", "uploads"),
    corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:3001")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
};
