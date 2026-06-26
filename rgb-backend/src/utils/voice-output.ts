import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const elevenlabs = new ElevenLabsClient({
  apiKey: String(process.env["ELEVENLABS_API_KEY"]),
});

export const generateSpeechStream = async (text: string) => {
  try {
    const audioStream = await elevenlabs.textToSpeech.stream(
      "FGY2WhTYpPnrIDTdsKH5",
      {
        text: text,
        modelId: "eleven_multilingual_v2",
        outputFormat: "mp3_44100_128",
      },
    );

    return audioStream;
  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    throw error;
  }
};
