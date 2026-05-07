// Serialize the in-memory `projects` array back into a TypeScript module
// that matches the hand-written shape of `src/data/projects.ts`. The output
// is committed back to the repo by the admin save flow.

import type { Project } from "@/data/projects";

const FILE_HEADER = `// Canonical project seed data — synced byte-identically with the prototype's
// window.PROJECTS in .spec/assets/prototype/data.js. The shape is fixed by
// .spec/13-prototype-literal-extracts.md §A.1 — do NOT rename fields.
//
// This file is rewritten by /api/admin/projects on save. Edit via /admin/projects
// or by hand — both paths produce the same shape.

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
  dateDisplay: string; // e.g. "March 2026"
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

// Backwards-compat alias.
export type TechItem = TechStackEntry;
`;

const FILE_FOOTER = `
// Empty array — prototype's BRANCHES = [] in data.js. The metro track has no
// abandoned/dead branches; only the line legend chip is rendered (decorative).
export const BRANCHES: never[] = [];
`;

export function serializeProjects(projects: Project[]): string {
  const body = `\nexport const projects: Project[] = ${pretty(projects, 2)};\n`;
  return FILE_HEADER + body + FILE_FOOTER;
}

// JSON.stringify with double-quoted keys + trailing newline, matching the file's
// existing formatting. Not pretty-perfect (Prettier will polish on next save)
// but produces a file Prettier-equivalent enough that diffs stay readable.
function pretty(value: unknown, indent: number): string {
  return JSON.stringify(value, null, indent)
    .replace(/"([a-zA-Z_][a-zA-Z0-9_]*)":/g, "$1:")
    .replace(/^"/gm, '"');
}
