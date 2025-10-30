import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createContact, deleteContact, listContacts, markSeen, } from "../controllers/contactController";
const router = Router();
// Public
router.post("/", createContact);
// Admin
router.get("/", requireAuth, listContacts);
router.put("/:id/seen", requireAuth, markSeen);
router.delete("/:id", requireAuth, deleteContact);
export default router;
