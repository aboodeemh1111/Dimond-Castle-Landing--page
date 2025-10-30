import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createNav,
  deleteNav,
  listNav,
  reorderNav,
  updateNav,
} from "../controllers/navController";

const router = Router();

router.get("/", requireAuth, listNav);
router.post("/", requireAuth, createNav);
router.put("/:id", requireAuth, updateNav);
router.delete("/:id", requireAuth, deleteNav);
router.post("/reorder", requireAuth, reorderNav);

export default router;
