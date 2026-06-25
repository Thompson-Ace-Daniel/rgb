import { type GenerateContentResponse, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: String(process.env["GEMINI_API_KEY"]) });

export const generateDraft = async (
  mode: string,
  tune: string,
  optional: string,
  recipient: string,
) => {
  const input = configureInput(optional, recipient);
  const instruction = configureInstruction(mode, tune);

  const modelQueue = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.5-flash",
  ];

  for (let i = 0; i < modelQueue.length; i++) {
    const currentModel = modelQueue[i];
    try {
      const response: GenerateContentResponse = await ai.models.generateContent(
        {
          model: String(currentModel),
          contents: input,
          config: {
            systemInstruction: instruction,
            temperature: 0.85,
            responseMimeType: "application/json",
          },
        },
      );

      const jsonOutput = JSON.parse(
        response.text || "An Error Occured while trying to generate RGB",
      );
      return jsonOutput;
    } catch (error: any) {
      const is503Busy =
        error?.status === 503 ||
        String(error).includes("high demand") ||
        String(error).includes("503");
      const hasNextModel = i < modelQueue.length - 1;

      if (is503Busy && hasNextModel) {
        console.warn(
          `Model ${currentModel} is busy. Falling back to ${modelQueue[i + 1]}...`,
        );
        continue;
      }

      console.error(
        `Execution failed permanently on model ${currentModel}:`,
        error,
      );
      break;
    }
  }
};

const configureInput = (optional: string, recipient: string) => {
  let input = "Surprise me";
  let name = "You";
  if (optional !== "") {
    input = optional.trim();
  }
  if (recipient !== "") {
    name = recipient.trim();
  }

  return `Tailor your response professionally to this request "${input}" and direct it to this name "${name}"`;
};

const configureInstruction = (mode: string, tune: string) => {
  let rgb = "";
  let character = "";

  switch (mode) {
    case "red":
      rgb = "roaster or insulter";
      break;
    case "blue":
      rgb = "complementer or sweet talker";
      break;
    case "green":
      rgb = "joker or comedian";
      break;
    default:
      rgb = "roaster or insulter";
      break;
  }
  switch (tune) {
    case "pidgin":
      character = "Nigerian Pidgin Speaker";
      break;
    case "fluent":
      character = "Native English speaker and smart person";
      break;
    case "default":
      character = "DIY and improvisor";
      break;
    case "dumb":
      character = "20 IQ human with zero brain cells";
      break;
    default:
      character = "DIY and improvisor";
      break;
  }

  let instruction = `You are a professional ${rgb}. Try your utmost best to be professional, clear, and concise as a ${character}. Return a JSON object with a single key 'text'.`;
  return instruction;
};
