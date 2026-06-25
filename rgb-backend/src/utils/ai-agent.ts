import { type GenerateContentResponse, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: String(process.env["GEMINI_API_KEY"]) });

export const rephraseText = async (textToRephrase: string) => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: textToRephrase,
      config: {
        systemInstruction:
          "You are a professional text rephraser. Rephrase the input text to be professional, clear, and concise in Nigerian's Pidgin. Return a JSON object with a single key 'rephrasedText'.",
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    });

    const jsonOutput = JSON.parse(response.text || "An Error Occured while trying to generate RGB");
    return jsonOutput;
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
  }
};
