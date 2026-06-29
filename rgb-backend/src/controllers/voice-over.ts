import { type Request, type Response } from "express";
import { Readable } from "stream";
import { generateSpeechStream } from "../utils/voice-output.js";

export const voiceOver = async (req: Request, res: Response): Promise<any> => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text prompt is required" });
  }

  try {
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    const audioStream = await generateSpeechStream(text);

    Readable.from(audioStream).pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate audio" });
  }
};
