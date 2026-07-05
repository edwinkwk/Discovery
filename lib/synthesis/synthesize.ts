import type { StructuredTraits } from "@/types/reading";
import { getClaudeClient } from "./claudeClient";
import { buildSynthesisPrompt, SYSTEM_PROMPT } from "./buildPrompt";

export async function synthesize(systemTraits: StructuredTraits[]): Promise<string> {
  if (systemTraits.length === 0) {
    throw new Error("Cannot synthesize a reading with zero successful system results");
  }

  const client = getClaudeClient();
  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildSynthesisPrompt(systemTraits) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude response contained no text content");
  }
  return textBlock.text;
}
