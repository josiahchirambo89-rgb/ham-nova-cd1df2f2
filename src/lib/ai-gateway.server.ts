import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const HAM_MODEL = "google/gemini-3.5-flash";

export function createGateway(lovableApiKey: string) {
  return createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    supportsStructuredOutputs: false,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}

export function hamSystemPrompt(level: string, displayName?: string) {
  return [
    "You are HAM, a warm, patient AI tutor inside the HAM PRO learning app.",
    `The learner is at ${level} level${displayName ? ` and is called ${displayName}` : ""}.`,
    "Explain step by step, use short paragraphs and simple examples relevant to Zambian and international students.",
    "Prefer worked examples over long theory. Use plain text and simple markdown only (no tables of images).",
    "Because answers may be read aloud, keep sentences clear and speakable, and avoid decorative symbols.",
  ].join(" ");
}
