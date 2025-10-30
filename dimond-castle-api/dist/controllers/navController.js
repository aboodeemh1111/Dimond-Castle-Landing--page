import { z } from "zod";
import { NavItem } from "../models/NavItem";
const upsertSchema = z.object({
    label: z.string().min(1),
    href: z.string().min(1),
    order: z.number().int().nonnegative().optional(),
    visible: z.boolean().optional(),
});
export async function listNav(_req, res) {
    const items = await NavItem.find().sort({ order: 1, createdAt: 1 }).exec();
    res.json(items);
}
export async function createNav(req, res) {
    const parse = upsertSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const created = await NavItem.create(parse.data);
    res.status(201).json(created);
}
export async function updateNav(req, res) {
    const { id } = req.params;
    const parse = upsertSchema.partial().safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const updated = await NavItem.findByIdAndUpdate(id, parse.data, {
        new: true,
    }).exec();
    if (!updated)
        return res.status(404).json({ error: "Not found" });
    res.json(updated);
}
export async function deleteNav(req, res) {
    const { id } = req.params;
    const deleted = await NavItem.findByIdAndDelete(id).exec();
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
}
export async function reorderNav(req, res) {
    const schema = z.array(z.object({ id: z.string(), order: z.number().int().nonnegative() }));
    const parse = schema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const ops = parse.data.map(({ id, order }) => NavItem.findByIdAndUpdate(id, { order }, { new: false }));
    await Promise.all(ops);
    res.json({ ok: true });
}
