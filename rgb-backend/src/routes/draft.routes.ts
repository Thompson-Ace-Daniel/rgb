import { Router } from "express";
import { createDraft } from "../controllers/ai-logic.js";

const router = Router();

router.post("/create-draft", createDraft);

export default router;
