import { NextResponse } from "next/server";
import { getAboutConfig } from "@/lib/about";
import { complete } from "@/lib/llm";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Public endpoint — bucket by client IP (best-effort) to keep the limit
  // enforced even for anonymous bulletin visitors. Behind Vercel the
  // forwarded-for header is trusted; locally it falls back to "anonymous".
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";
  const rl = await checkRateLimit(`ask:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(rateLimitResponse(rl), { status: 429 });
  }

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
