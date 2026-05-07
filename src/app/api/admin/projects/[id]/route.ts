import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { writeFile } from "@/lib/github";
import { serializeProjects } from "@/lib/serialize-projects";
import { projects as currentProjects, type Project } from "@/data/projects";

const PATH = "src/data/projects.ts";

interface Ctx {
  params: Promise<{ id: string }>;
}

function normalize(input: Partial<Project>, fallbackId: string): Project {
  const title = (input.title || "").trim();
  return {
    id: (input.id || fallbackId).trim(),
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

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const idx = currentProjects.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json(
      { error: "project not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }
  const body = (await req.json()) as Partial<Project>;
  const project = normalize(body, id);

  if (project.id !== id && currentProjects.some((p) => p.id === project.id)) {
    return NextResponse.json(
      { error: `id "${project.id}" already exists`, code: "CONFLICT" },
      { status: 409 },
    );
  }

  const next = [...currentProjects];
  next[idx] = project;
  next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  try {
    const { commitSha } = await writeFile({
      path: PATH,
      content: serializeProjects(next),
      message: `feat(projects): update "${project.title}"`,
    });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ project, commitSha });
  } catch (e) {
    console.error("[admin/projects PUT]", e);
    return NextResponse.json(
      { error: "GitHub commit failed", code: "GITHUB_ERROR" },
      { status: 502 },
    );
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const idx = currentProjects.findIndex((p) => p.id === id);
  if (idx === -1) {
    return NextResponse.json(
      { error: "project not found", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const next = currentProjects.filter((p) => p.id !== id);

  try {
    const { commitSha } = await writeFile({
      path: PATH,
      content: serializeProjects(next),
      message: `chore(projects): remove "${currentProjects[idx].title}"`,
    });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return NextResponse.json({ deletedId: id, commitSha });
  } catch (e) {
    console.error("[admin/projects DELETE]", e);
    return NextResponse.json(
      { error: "GitHub commit failed", code: "GITHUB_ERROR" },
      { status: 502 },
    );
  }
}
