import { type Request, type Response } from "express";
import {
  generateDraft,
  DraftGenerationError,
  type DraftMode,
  type DraftTune,
} from "../utils/ai-agent.js";

const VALID_MODES: DraftMode[] = ["red", "blue", "green"];
const VALID_TUNES: DraftTune[] = ["pidgin", "fluent", "default", "dumb"];

export const createDraft = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { mode, tune, request, recipient } = req.body as {
    mode?: string;
    tune?: string;
    request?: string;
    recipient?: string;
  };

  if (!mode || !VALID_MODES.includes(mode as DraftMode)) {
    res.status(400).json({
      error: `Invalid or missing "mode". Expected one of: ${VALID_MODES.join(", ")}.`,
    });
    return;
  }

  if (!tune || !VALID_TUNES.includes(tune as DraftTune)) {
    res.status(400).json({
      error: `Invalid or missing "tune". Expected one of: ${VALID_TUNES.join(", ")}.`,
    });
    return;
  }

  if (request !== undefined && typeof request !== "string") {
    res.status(400).json({ error: '"request" must be a string.' });
    return;
  }

  if (recipient !== undefined && typeof recipient !== "string") {
    res.status(400).json({ error: '"recipient" must be a string.' });
    return;
  }

  try {
    const draft = await generateDraft({
      mode: mode as DraftMode,
      tune: tune as DraftTune,
      request,
      recipient,
    });

    res.status(200).json(draft);
  } catch (err) {
    if (err instanceof DraftGenerationError) {
      console.error("Draft generation failed:", err.message, err.cause);
      res
        .status(502)
        .json({ error: "Draft generation failed. Please try again." });
      return;
    }

    console.error("Unexpected error in createDraft:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
