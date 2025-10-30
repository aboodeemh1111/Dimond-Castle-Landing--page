import path from "path";
import fs from "fs";
import { Media } from "../models/Media";
import { config } from "../config/env";
export async function uploadMedia(req, res) {
    if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });
    const { filename, size } = req.file;
    const url = `/uploads/${filename}`;
    const created = await Media.create({ url, type: "image", bytes: size });
    res.status(201).json(created);
}
export async function listMedia(_req, res) {
    const items = await Media.find().sort({ createdAt: -1 }).limit(200).exec();
    res.json(items);
}
export async function deleteMedia(req, res) {
    const id = req.params.id;
    const doc = await Media.findByIdAndDelete(id).exec();
    if (!doc)
        return res.status(404).json({ error: "Not found" });
    // Best-effort delete from disk
    try {
        const filePath = path.resolve(process.cwd(), config.uploadDir, path.basename(doc.url));
        fs.unlink(filePath, () => { });
    }
    catch { }
    res.json({ ok: true });
}
