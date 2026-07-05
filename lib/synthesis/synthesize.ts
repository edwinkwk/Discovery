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
      // gemini-3.5-flash has thinking enabled by default, and thinking tokens are
      // deducted from maxOutputTokens before any visible text is produced — a low
      // ceiling here truncates the narrative mid-sentence rather than erroring.
      maxOutputTokens: 8192,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === "MAX_TOKENS") {
    throw new Error("Gemini response was truncated (hit maxOutputTokens before finishing)");
  }
  return text;
}
