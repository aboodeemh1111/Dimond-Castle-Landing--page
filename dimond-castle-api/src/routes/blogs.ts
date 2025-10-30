import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createPost,
  deletePost,
  getPost,
  listPosts,
  updatePost,
} from "../controllers/blogController";

const router = Router();

router.get("/", requireAuth, listPosts);
router.post("/", requireAuth, createPost);
router.get("/:id", requireAuth, getPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

export default router;
