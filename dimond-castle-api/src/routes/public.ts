import { Router } from "express";
import { NavItem } from "../models/NavItem";
import { Page } from "../models/Page";
import { BlogPost } from "../models/BlogPost";
import { setPublicCache } from "../utils/cache";

const router = Router();

router.get("/nav", async (_req, res) => {
  const items = await NavItem.find({ visible: true })
    .sort({ order: 1, createdAt: 1 })
    .exec();
  setPublicCache(res);
  res.json(items);
});

router.get("/pages/:path(*)", async (req, res) => {
  const path = "/" + (req.params.path || "");
  const doc = await Page.findOne({ path, published: true }).exec();
  if (!doc) return res.status(404).json({ error: "Not found" });
  setPublicCache(res);
  res.json(doc);
});

router.get("/blogs", async (_req, res) => {
  const items = await BlogPost.find({ status: { $ne: "archived" } })
    .sort({ publishedAt: -1, createdAt: -1 })
    .exec();
  setPublicCache(res);
  res.json(items);
});

router.get("/blogs/slug/:slug", async (req, res) => {
  const { slug } = req.params;
  const doc = await BlogPost.findOne({
    slug,
    status: { $ne: "archived" },
  }).exec();
  if (!doc) return res.status(404).json({ error: "Not found" });
  setPublicCache(res);
  res.json(doc);
});

export default router;
