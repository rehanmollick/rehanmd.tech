/**
 * LLM router — Anthropic Claude primary, Groq Llama fallback.
 * Used by /api/admin/compose (brain-dump → newspaper) and /api/ask-claude.
 */
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export async function complete(opts: {
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
}): Promise<string> {
  // Try Anthropic first
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const a = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const res = await a.messages.create({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: opts.maxTokens ?? 2048,
        system: opts.system,
        messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const text = res.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("");
      if (text.trim()) return text;
    } catch (err) {
      console.error("[llm] Anthropic failed, falling back to Groq:", err);
    }
  }

  // Groq fallback
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Both Anthropic and Groq unavailable. Set ANTHROPIC_API_KEY or GROQ_API_KEY.");
  }
  const g = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const res = await g.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: opts.maxTokens ?? 2048,
    messages: [
      { role: "system", content: opts.system },
      ...opts.messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  });
  return res.choices[0]?.message?.content ?? "";
}
