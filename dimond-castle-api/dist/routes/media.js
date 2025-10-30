import { Router } from "express";
import multer from "multer";
import path from "path";
import { config } from "../config/env";
import { requireAuth, requireRole } from "../middleware/auth";
import { deleteMedia, listMedia, uploadMedia, } from "../controllers/mediaController";
const router = Router();
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.resolve(process.cwd(), config.uploadDir)),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path
            .basename(file.originalname, ext)
            .replace(/[^a-z0-9-_]/gi, "_");
        const name = `${base}-${Date.now()}${ext}`;
        cb(null, name);
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
router.post("/upload", requireAuth, requireRole("admin"), upload.single("file"), uploadMedia);
router.get("/", requireAuth, listMedia);
router.delete("/:id", requireAuth, requireRole("admin"), deleteMedia);
export default router;
