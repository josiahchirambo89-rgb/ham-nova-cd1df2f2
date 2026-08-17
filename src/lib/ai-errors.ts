export function aiErrorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  if (raw.includes("429")) return "HAM is busy right now — try again in a moment.";
  if (raw.includes("402")) return "AI credits are exhausted for this workspace.";
  if (raw.includes("403")) return "AI access is blocked for this workspace.";
  return raw || "AI request failed";
}
