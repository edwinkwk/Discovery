import type { StructuredTraits } from "@/types/reading";
import { getGeminiClient } from "./geminiClient";
import { buildSynthesisPrompt, SYSTEM_PROMPT } from "./buildPrompt";

const MODEL = "gemini-3.5-flash";

export async function synthesize(systemTraits: StructuredTraits[]): Promise<string> {
  if (systemTraits.length === 0) {
    throw new Error("Cannot synthesize a reading with zero successful system results");
  }

  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: MODEL,
    contents: buildSynthesisPrompt(systemTraits),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      maxOutputTokens: 2048,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  return text;
}
