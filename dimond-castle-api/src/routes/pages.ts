import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createPage,
  deletePage,
  getPage,
  listPages,
  updatePage,
} from "../controllers/pageController";

const router = Router();

router.get("/", requireAuth, listPages);
router.post("/", requireAuth, createPage);
router.get("/:id", requireAuth, getPage);
router.put("/:id", requireAuth, updatePage);
router.delete("/:id", requireAuth, deletePage);

export default router;
