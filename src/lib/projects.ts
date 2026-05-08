// Project content lives in per-folder Markdown files at:
//
//   public/projects/<id>/project.md          (frontmatter)
//   public/projects/<id>/<image|video files> (slides, referenced by filename)
//
// Frontmatter shape mirrors the legacy Project interface. Slide entries are
// resolved at read-time so the rest of the app sees absolute /projects/<id>/<file>
// URLs that Next can serve as static assets.
//
// To add a new project: create `public/projects/<id>/project.md`, drop slide
// images alongside, commit. No build step, no admin, no DB.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "public/projects");

export type ProjectSlide =
  | { type: "placeholder"; label: string }
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; alt?: string };

export interface TechStackEntry {
  name: string;
  reason: string;
}

export interface Project {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  dateDisplay: string;
  stationName: string;
  description: string;
  slides: ProjectSlide[];
  liveUrl: string | null;
  repoUrl: string | null;
  context: string | null;
  techStack: TechStackEntry[];
  tags: string[];
  featured?: boolean;
}

export type TechItem = TechStackEntry;

// Frontmatter authors use shorthand; the reader normalizes into ProjectSlide.
type SlideInput =
  | string // → { type: "image", src, alt: "" }
  | {
      src?: string;
      alt?: string;
      label?: string; // → placeholder
      poster?: string;
      type?: "image" | "video" | "placeholder";
    };

function normalizeSlide(input: SlideInput, id: string): ProjectSlide {
  if (typeof input === "string") {
    return { type: "image", src: `/projects/${id}/${input}`, alt: "" };
  }
  if (input.type === "placeholder" || (input.label && !input.src)) {
    return { type: "placeholder", label: input.label || "media" };
  }
  if (input.type === "video" || (input.src && /\.(mp4|webm|mov)$/i.test(input.src))) {
    return {
      type: "video",
      src: input.src!.startsWith("/")
        ? input.src!
        : `/projects/${id}/${input.src}`,
      alt: input.alt,
      poster: input.poster
        ? input.poster.startsWith("/")
          ? input.poster
          : `/projects/${id}/${input.poster}`
        : undefined,
    };
  }
  return {
    type: "image",
    src: input.src!.startsWith("/") ? input.src! : `/projects/${id}/${input.src}`,
    alt: input.alt || "",
  };
}

function parseProjectFile(id: string): Project | null {
  const filePath = path.join(PROJECTS_DIR, id, "project.md");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);

  const dateStr =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date || "");

  const slidesIn = (data.slides ?? []) as SlideInput[];
  const slides = slidesIn.map((s) => normalizeSlide(s, id));

  return {
    id,
    title: String(data.title || id),
    date: dateStr,
    dateDisplay: String(data.dateDisplay || ""),
    stationName: String(data.stationName || data.title || id),
    description: String(data.description || ""),
    slides,
    liveUrl: data.liveUrl || null,
    repoUrl: data.repoUrl || null,
    context: data.context || null,
    techStack: (data.techStack || []) as TechStackEntry[],
    tags: (data.tags || []) as string[],
    featured: Boolean(data.featured),
  };
}

/** All projects, sorted newest-first by ISO `date`. Featured project floats to top. */
export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  const ids = fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const projects = ids
    .map((id) => parseProjectFile(id))
    .filter((p): p is Project => p !== null);

  projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return projects;
}

/** Single project lookup by id. */
export function getProjectById(id: string): Project | null {
  return parseProjectFile(id);
}

/** Empty array — prototype's BRANCHES = []. The metro track has no abandoned/dead branches. */
export const BRANCHES: never[] = [];
