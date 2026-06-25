import { type Request, type Response } from "express";
import { generateDraft } from "../utils/ai-agent.js";

export const createDraft = async (req: Request, res: Response) => {
  try {
    const { mode, tune, optional, recipient } = req.body as {
      mode: string;
      tune: string;
      optional: string;
      recipient: string;
    };
    const response = await generateDraft(mode, tune, optional, recipient);
    res.status(200).json(response);
  } catch (err) {
    console.error("An error occured while trying to get response");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
