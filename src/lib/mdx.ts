// Dispatch (blog) content lives in per-folder MDX files at:
//
//   public/dispatches/<slug>/dispatch.mdx     (frontmatter + MDX body)
//   public/dispatches/<slug>/<image files>    (optional, referenced from MDX body)
//
// To add a dispatch: create `public/dispatches/<slug>/dispatch.mdx`, drop
// any inline images alongside, commit. No build step, no admin.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DISPATCHES_DIR = path.join(process.cwd(), "public/dispatches");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function metaFromFrontmatter(slug: string, data: Record<string, unknown>): BlogPostMeta {
  const dateStr =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date || "1970-01-01");
  return {
    slug,
    title: String(data.title || slug),
    date: dateStr,
    tags: (data.tags as string[]) || [],
    excerpt: String(data.excerpt || ""),
    readTime: typeof data.readTime === "number" ? data.readTime : 2,
  };
}

/** All dispatch metadata, sorted oldest-first so the literal "First Post"
 * (and any earlier writing) pins to the top of the wall, with newer
 * dispatches appended after. */
export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(DISPATCHES_DIR)) return [];
  const slugs = fs
    .readdirSync(DISPATCHES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const posts = slugs
    .map((slug) => {
      const filePath = path.join(DISPATCHES_DIR, slug, "dispatch.mdx");
      if (!fs.existsSync(filePath)) return null;
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      return metaFromFrontmatter(slug, data);
    })
    .filter((p): p is BlogPostMeta => p !== null);

  return posts.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

/** Single dispatch (frontmatter + MDX body). */
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(DISPATCHES_DIR, slug, "dispatch.mdx");
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { ...metaFromFrontmatter(slug, data), content };
}

/** Slugs for generateStaticParams. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(DISPATCHES_DIR)) return [];
  return fs
    .readdirSync(DISPATCHES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}
