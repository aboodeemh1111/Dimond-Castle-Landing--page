import { z } from "zod";
import { Page } from "../models/Page";
const upsertSchema = z.object({
    path: z.string().min(1),
    title: z.string().min(1),
    seo: z
        .object({
        description: z.string().optional(),
        image: z.string().url().optional(),
    })
        .partial()
        .optional(),
    blocks: z.any().array().default([]),
    published: z.boolean().default(false),
});
export async function createPage(req, res) {
    const parse = upsertSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const created = await Page.create(parse.data);
    res.status(201).json(created);
}
export async function listPages(_req, res) {
    const items = await Page.find().sort({ updatedAt: -1 }).exec();
    res.json(items);
}
export async function getPage(req, res) {
    const { id } = req.params;
    const item = await Page.findById(id).exec();
    if (!item)
        return res.status(404).json({ error: "Not found" });
    res.json(item);
}
export async function updatePage(req, res) {
    const { id } = req.params;
    const parse = upsertSchema.partial().safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const updated = await Page.findByIdAndUpdate(id, parse.data, {
        new: true,
    }).exec();
    if (!updated)
        return res.status(404).json({ error: "Not found" });
    res.json(updated);
}
export async function deletePage(req, res) {
    const { id } = req.params;
    const deleted = await Page.findByIdAndDelete(id).exec();
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
}
