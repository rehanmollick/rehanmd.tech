import { NextResponse } from "next/server";
import { writeFile } from "@/lib/github";

interface PostPayload {
  slug: string;
  headline: string;
  dek?: string;
  dateline?: string;
  tags?: string[];
  body: string;
}

export async function POST(req: Request) {
  const p = (await req.json()) as PostPayload;
  if (!p.slug || !p.headline || !p.body) {
    return NextResponse.json({ error: "Missing slug/headline/body" }, { status: 400 });
  }

  const date = new Date().toISOString().slice(0, 10);
  const frontmatter = [
    "---",
    `title: "${escape(p.headline)}"`,
    `dek: "${escape(p.dek || "")}"`,
    `date: "${date}"`,
    `dateline: "${escape(p.dateline || "AUSTIN, TX")}"`,
    `tags: [${(p.tags || []).map((t) => `"${escape(t)}"`).join(", ")}]`,
    "---",
    "",
  ].join("\n");

  const path = `src/content/blog/${p.slug}.mdx`;
  const content = frontmatter + p.body;

  try {
    const { commitSha } = await writeFile({
      path,
      content,
      message: `dispatch: ${p.headline}`,
    });
    return NextResponse.json({ ok: true, path, commitSha });
  } catch (e) {
    console.error("[posts] commit error", e);
    return NextResponse.json({ error: "Commit failed" }, { status: 500 });
  }
}

function escape(s: string) {
  return s.replace(/"/g, '\\"');
}
