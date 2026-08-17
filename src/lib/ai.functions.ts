import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const chatInput = z.object({
  level: z.string().default("secondary"),
  displayName: z.string().optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1),
});

const identifyInput = z.object({
  imageDataUrl: z.string().min(20),
  level: z.string().default("secondary"),
  hint: z.string().optional(),
});

const testInput = z.object({
  subject: z.string(),
  level: z.string(),
  count: z.number().int().min(1).max(30),
});

export const hamChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => chatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured");
    const { streamText } = await import("ai");
    const { createGateway, HAM_MODEL, hamSystemPrompt } = await import("./ai-gateway.server");
    const gateway = createGateway(key);
    try {
      const result = streamText({
        model: gateway(HAM_MODEL),
        system: hamSystemPrompt(data.level, data.displayName),
        messages: data.messages,
      });
      return { text: await result.text };
    } catch (error) {
      throw new Error(aiErrorMessage(error));
    }
  });

export const identifyImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => identifyInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured");
    const { streamText } = await import("ai");
    const { createGateway, HAM_MODEL } = await import("./ai-gateway.server");
    const gateway = createGateway(key);
    try {
      const result = streamText({
        model: gateway(HAM_MODEL),
        system:
          "You identify what is in a photo for a student and produce study notes. " +
          `Write for a ${data.level} level learner. ` +
          "Reply in this exact shape: first line 'TITLE: <short name>', second line 'SUBJECT: <school subject>', " +
          "then a blank line, then clear study notes with a short explanation, key facts as '- ' bullets, and one exam-style question with its answer.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: data.hint
                  ? `Identify this and make notes. Extra context: ${data.hint}`
                  : "Identify this and make study notes.",
              },
              { type: "image", image: new URL(data.imageDataUrl) },
            ],
          },
        ],
      });
      const text = await result.text;
      const title = /TITLE:\s*(.+)/i.exec(text)?.[1]?.trim() ?? "Identified item";
      const subject = /SUBJECT:\s*(.+)/i.exec(text)?.[1]?.trim() ?? "General";
      const body = text.replace(/TITLE:.*\n?/i, "").replace(/SUBJECT:.*\n?/i, "").trim();
      return { title, subject, notes: body };
    } catch (error) {
      throw new Error(aiErrorMessage(error));
    }
  });

export const generateTest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => testInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured");
    const { streamText } = await import("ai");
    const { createGateway, HAM_MODEL } = await import("./ai-gateway.server");
    const gateway = createGateway(key);
    try {
      const result = streamText({
        model: gateway(HAM_MODEL),
        system:
          "You write multiple-choice tests for students. Reply with ONLY a JSON array, no markdown fences. " +
          "Each element: {\"question\": string, \"options\": [4 strings], \"answer\": 0-3 index of the correct option, \"explanation\": string}.",
        prompt: `Write ${data.count} varied ${data.subject} questions for a ${data.level} level learner following the Zambian ECZ and Cambridge syllabuses.`,
      });
      const text = await result.text;
      const json = text.slice(text.indexOf("["), text.lastIndexOf("]") + 1);
      const parsed = z
        .array(
          z.object({
            question: z.string(),
            options: z.array(z.string()).min(2),
            answer: z.number().int(),
            explanation: z.string().default(""),
          }),
        )
        .parse(JSON.parse(json));
      return { questions: parsed.slice(0, data.count) };
    } catch (error) {
      throw new Error(aiErrorMessage(error));
    }
  });

function aiErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes("429")) return "HAM is busy right now — try again in a moment.";
  if (raw.includes("402")) return "AI credits are exhausted for this workspace.";
  if (raw.includes("403")) return "AI access is blocked for this workspace.";
  return raw || "AI request failed";
}
