import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { config } from "./config/env";
import { connectToDatabase } from "./db/mongoose";
import authRoutes from "./routes/auth";
import mediaRoutes from "./routes/media";
import blogRoutes from "./routes/blogs";
import pageRoutes from "./routes/pages";
import navRoutes from "./routes/nav";
import contactRoutes from "./routes/contacts";
import publicRoutes from "./routes/public";
async function bootstrap() {
    await connectToDatabase();
    const app = express();
    app.set("trust proxy", 1);
    app.use(helmet());
    app.use(cors({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            if (config.corsOrigins.includes(origin))
                return cb(null, true);
            return cb(new Error("Not allowed by CORS"));
        },
        credentials: true,
    }));
    app.use(express.json({ limit: "2mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
    // Ensure uploads dir exists and serve statics
    fs.mkdirSync(path.resolve(process.cwd(), config.uploadDir), {
        recursive: true,
    });
    app.use("/uploads", express.static(path.resolve(process.cwd(), config.uploadDir), {
        maxAge: "365d",
        immutable: true,
    }));
    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });
    // TODO: mount routes (auth, media, blogs, pages, nav, contacts, public)
    app.use("/auth", authRoutes);
    app.use("/media", mediaRoutes);
    app.use("/blogs", blogRoutes);
    app.use("/pages", pageRoutes);
    app.use("/nav", navRoutes);
    app.use("/contacts", contactRoutes);
    app.use("/public", publicRoutes);
    // Error handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err, _req, res, _next) => {
        const status = err.status || 500;
        const message = err.message || "Internal Server Error";
        if (config.nodeEnv !== "production") {
            // Basic error info in non-prod
            // Avoid leaking stack in prod responses
            // eslint-disable-next-line no-console
            console.error(err);
        }
        res.status(status).json({ error: message });
    });
    app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${config.port}`);
    });
}
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", err);
    process.exit(1);
});
