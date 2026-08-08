import { type GenerateContentResponse, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env["GEMINI_API_KEY"] ?? "" });

// --- Types ---

export type DraftMode = "red" | "blue" | "green";
export type DraftTune = "pidgin" | "fluent" | "default" | "dumb";

export interface GenerateDraftOptions {
  mode: DraftMode;
  tune: DraftTune;
  request?: string;
  recipient?: string;
  maxRetriesPerModel?: number;
}

export interface DraftResult {
  text: string;
  modelUsed: string;
}

// --- Config ---

const MODEL_QUEUE = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
] as const;

const MODE_PERSONAS: Record<DraftMode, string> = {
  red: "roaster or insulter",
  blue: "complimenter or sweet talker",
  green: "joker or comedian",
};

const TUNE_PERSONAS: Record<DraftTune, string> = {
  pidgin: "Nigerian Pidgin speaker",
  fluent: "native English speaker and articulate professional",
  default: "resourceful improviser",
  dumb: "comically unintelligent, dim-witted character",
};

// --- Errors ---

export class DraftGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "DraftGenerationError";
  }
}

// --- Public API ---

export const generateDraft = async (
  options: GenerateDraftOptions,
): Promise<DraftResult> => {
  const { mode, tune, request, recipient, maxRetriesPerModel = 1 } = options;

  const contents = buildPrompt(request, recipient);
  const systemInstruction = buildInstruction(mode, tune);

  let lastError: unknown;

  for (const model of MODEL_QUEUE) {
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        const response: GenerateContentResponse =
          await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction,
              temperature: 0.85,
              responseMimeType: "application/json",
            },
          });

        return parseResponse(response, model);
      } catch (error) {
        lastError = error;

        if (isRetryableError(error)) {
          console.warn(
            `[generateDraft] ${model} unavailable (attempt ${attempt}/${maxRetriesPerModel}).`,
          );
          if (attempt < maxRetriesPerModel) {
            await sleep(backoffMs(attempt));
            continue;
          }
          break; // move to next model
        }

        // Non-retryable error: stop entirely
        throw new DraftGenerationError(
          `Draft generation failed on ${model} with a non-retryable error.`,
          error,
        );
      }
    }
  }

  throw new DraftGenerationError(
    "All models exhausted; draft generation failed.",
    lastError,
  );
};

// --- Helpers ---

const buildPrompt = (request?: string, recipient?: string): string => {
  const trimmedRequest = request?.trim() || "Surprise me";
  const trimmedRecipient = recipient?.trim() || "You";

  return `Tailor your response professionally to this request: "${trimmedRequest}". Direct it to this name: "${trimmedRecipient}".`;
};

const buildInstruction = (mode: DraftMode, tune: DraftTune): string => {
  const persona = MODE_PERSONAS[mode];
  const character = TUNE_PERSONAS[tune];

  return `You are a professional ${persona}. Write as a ${character}, staying clear and concise while committing fully to the tone. Return a JSON object with a single key "text" containing the drafted message.`;
};

const parseResponse = (
  response: GenerateContentResponse,
  modelUsed: string,
): DraftResult => {
  if (!response.text) {
    throw new DraftGenerationError(`Empty response from ${modelUsed}.`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(response.text);
  } catch (error) {
    throw new DraftGenerationError(
      `Failed to parse JSON from ${modelUsed}.`,
      error,
    );
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { text?: unknown }).text !== "string"
  ) {
    throw new DraftGenerationError(
      `Response from ${modelUsed} did not match expected shape.`,
    );
  }

  return { text: (parsed as { text: string }).text, modelUsed };
};

const isRetryableError = (error: unknown): boolean => {
  const err = error as { status?: number; message?: string };
  const message = String(err?.message ?? error ?? "");

  return (
    err?.status === 503 ||
    err?.status === 429 ||
    message.includes("high demand") ||
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("RESOURCE_EXHAUSTED")
  );
};

const backoffMs = (attempt: number): number =>
  Math.min(1000 * 2 ** (attempt - 1), 8000);

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
