import { Request, Response } from "express";
import { z } from "zod";
import { ContactMessage } from "../models/ContactMessage";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

export async function createContact(req: Request, res: Response) {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const created = await ContactMessage.create(parse.data);
  res.status(201).json(created);
}

export async function listContacts(_req: Request, res: Response) {
  const items = await ContactMessage.find().sort({ createdAt: -1 }).exec();
  res.json(items);
}

export async function markSeen(req: Request, res: Response) {
  const { id } = req.params;
  const updated = await ContactMessage.findByIdAndUpdate(
    id,
    { seen: true },
    { new: true }
  ).exec();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
}

export async function deleteContact(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await ContactMessage.findByIdAndDelete(id).exec();
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
}
