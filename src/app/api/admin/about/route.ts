import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { setAboutConfig, type AboutConfig } from "@/lib/about";

// Admin-protected by middleware.ts (login allow-listed to ADMIN_GITHUB_LOGIN).
// Writes the partial config into Vercel KV under `about:config`.

export async function PUT(req: Request) {
  let body: Partial<AboutConfig>;
  try {
    body = (await req.json()) as Partial<AboutConfig>;
  } catch {
    return NextResponse.json(
      { error: "invalid JSON", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  try {
    const merged = await setAboutConfig(body);
    revalidateTag("about");
    revalidatePath("/");
    return NextResponse.json({ ok: true, about: merged });
  } catch (e) {
    console.error("[admin/about PUT]", e);
    return NextResponse.json(
      { error: "KV write failed", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
