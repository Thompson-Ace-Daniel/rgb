import { Router } from "express";
import { voiceOver } from "../controllers/voice-over.js";

const router = Router();
router.post("/generate-audio", voiceOver);

export default router;
