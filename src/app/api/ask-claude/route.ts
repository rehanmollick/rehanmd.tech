import { NextResponse } from "next/server";
import { getAboutConfig } from "@/lib/about";
import { complete } from "@/lib/llm";

export async function POST(req: Request) {
  const body = (await req.json()) as { question?: string };
  const q = (body.question || "").trim();
  if (!q) return NextResponse.json({ error: "Empty question" }, { status: 400 });
  if (q.length > 800)
    return NextResponse.json({ error: "Question too long" }, { status: 413 });

  const cfg = await getAboutConfig();

  try {
    const answer = await complete({
      system: `${cfg.bioPrompt}\n\nAnswer in 2–4 sentences. Conversational, dry humor OK. Do not invent facts that contradict the bio.`,
      messages: [{ role: "user", content: q }],
      maxTokens: 400,
    });
    return NextResponse.json({ answer });
  } catch (e) {
    console.error("[ask-claude] error:", e);
    return NextResponse.json(
      { answer: "Couldn't reach the model right now. Try again in a minute." },
      { status: 200 },
    );
  }
}
