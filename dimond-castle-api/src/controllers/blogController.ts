import { Request, Response } from "express";
import { z } from "zod";
import { BlogPost } from "../models/BlogPost";

const upsertSchema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/i)
    .optional(),
  excerpt: z.string().optional(),
  blocks: z.any().array().default([]),
  coverImage: z.string().url().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.string().array().optional(),
  publishedAt: z.string().datetime().optional(),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createPost(req: Request, res: Response) {
  const parse = upsertSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data;
  const slug = data.slug ?? slugify(data.title);
  const created = await BlogPost.create({ ...data, slug });
  res.status(201).json(created);
}

export async function listPosts(_req: Request, res: Response) {
  const items = await BlogPost.find().sort({ createdAt: -1 }).exec();
  res.json(items);
}

export async function getPost(req: Request, res: Response) {
  const { id } = req.params;
  const item = await BlogPost.findById(id).exec();
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
}

export async function updatePost(req: Request, res: Response) {
  const { id } = req.params;
  const parse = upsertSchema.partial().safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data;
  if (data.title && !data.slug) data.slug = slugify(data.title);
  const updated = await BlogPost.findByIdAndUpdate(id, data, {
    new: true,
  }).exec();
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
}

export async function deletePost(req: Request, res: Response) {
  const { id } = req.params;
  const deleted = await BlogPost.findByIdAndDelete(id).exec();
  if (!deleted) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
}
