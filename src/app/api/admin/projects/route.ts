import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { writeFile } from "@/lib/github";
import { serializeProjects } from "@/lib/serialize-projects";
import { projects as currentProjects, type Project } from "@/data/projects";

const PATH = "src/data/projects.ts";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalize(input: Partial<Project>): Project {
  const title = (input.title || "").trim();
  const id = (input.id || "").trim() || slugify(title);
  return {
    id,
    title,
    date: (input.date || "").trim(),
    dateDisplay: (input.dateDisplay || "").trim(),
    stationName: (input.stationName || "").trim() || title,
    description: (input.description || "").trim(),
    slides: input.slides || [],
    liveUrl: input.liveUrl ?? null,
    repoUrl: input.repoUrl ?? null,
    context: input.context ?? null,
    techStack: (input.techStack || []).filter((t) => t.name?.trim()),
    tags: input.tags || [],
    featured: input.featured,
  };
}

function validate(p: Project): string | null {
  if (!p.id) return "id required";
  if (!p.title) return "title required";
  if (!p.date) return "date required";
  if (!p.description) return "description required";
  if (p.techStack.length === 0) return "techStack required (at least 1 entry)";
  return null;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<Project>;
  const project = normalize(body);
  const err = validate(project);
  if (err) {
    return NextResponse.json({ error: err, code: "INVALID_INPUT" }, { status: 400 });
  }

  if (currentProjects.some((p) => p.id === project.id)) {
    return NextResponse.json(
      { error: `id "${project.id}" already exists`, code: "CONFLICT" },
      { status: 409 },
    );
  }

  const next = [project, ...currentProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  try {
    const { commitSha } = await writeFile({
      path: PATH,
      content: serializeProjects(next),
      message: `feat(projects): add "${project.title}"`,
    });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ project, commitSha }, { status: 201 });
  } catch (e) {
    console.error("[admin/projects POST]", e);
    return NextResponse.json(
      { error: "GitHub commit failed", code: "GITHUB_ERROR" },
      { status: 502 },
    );
  }
}
