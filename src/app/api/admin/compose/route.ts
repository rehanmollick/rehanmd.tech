import { NextResponse } from "next/server";
import { complete } from "@/lib/llm";

/**
 * Brain-dump → newspaper composer.
 * Takes raw notes/transcript and produces a structured MDX dispatch.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as { brainDump?: string };
  const dump = (body.brainDump || "").trim();
  if (!dump) return NextResponse.json({ error: "Empty brain dump" }, { status: 400 });

  const system = `You are a writing assistant for Rehan's personal newspaper-style blog called "Dispatches."

Take the raw brain-dump below and turn it into a publish-ready MDX dispatch with newspaper voice — punchy, dry, observational, first person, no business jargon.

Return ONLY valid JSON (no markdown fence, no commentary) with this shape:
{
  "slug": "kebab-case-slug",
  "headline": "ALL-CAPS HEADLINE, 4-9 WORDS",
  "dek": "One-sentence subhead, sentence case, 12-22 words",
  "dateline": "AUSTIN, TX",
  "tags": ["lowercase-tag", "..."],
  "body": "Full markdown body. Use ## for section breaks. Include a pull quote with > syntax somewhere. 350-700 words."
}

Constraints:
- Slug must be unique-ish and URL-safe.
- Tags: 2-4 single words.
- Body must be valid markdown that renders in MDX.`;

  let raw = "";
  try {
    raw = await complete({
      system,
      messages: [{ role: "user", content: dump }],
      maxTokens: 2200,
    });
  } catch (e) {
    console.error("[compose] LLM error", e);
    return NextResponse.json({ error: "LLM unavailable" }, { status: 502 });
  }

  // Strip code fences if the model added any
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Model returned malformed JSON", raw: cleaned.slice(0, 500) },
      { status: 502 },
    );
  }

  return NextResponse.json(parsed);
}
