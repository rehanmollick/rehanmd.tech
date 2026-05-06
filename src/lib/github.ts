/**
 * GitHub Contents API helper — used by /api/admin/posts and /api/admin/projects
 * to commit MDX files and projects.ts changes back to the repo.
 */
import { Octokit } from "@octokit/rest";

const owner = process.env.GITHUB_OWNER || "rehanmollick";
const repo = process.env.GITHUB_REPO || "rehanmd.tech";
const branch = process.env.GITHUB_BRANCH || "main";

function client() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN missing — set it in .env.local");
  }
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

/** Read a file's current content + sha (sha is required when updating). */
export async function readFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const o = client();
    const res = await o.repos.getContent({ owner, repo, path, ref: branch });
    if (Array.isArray(res.data) || res.data.type !== "file") return null;
    const content = Buffer.from(res.data.content, "base64").toString("utf8");
    return { content, sha: res.data.sha };
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) return null;
    throw e;
  }
}

/** Create or update a file. */
export async function writeFile(opts: {
  path: string;
  content: string;
  message: string;
}): Promise<{ commitSha: string }> {
  const o = client();
  const existing = await readFile(opts.path);
  const res = await o.repos.createOrUpdateFileContents({
    owner,
    repo,
    branch,
    path: opts.path,
    message: opts.message,
    content: Buffer.from(opts.content, "utf8").toString("base64"),
    sha: existing?.sha,
    committer: { name: "rehanmollick", email: "rehanmollick07@gmail.com" },
    author: { name: "rehanmollick", email: "rehanmollick07@gmail.com" },
  });
  return { commitSha: res.data.commit.sha! };
}

/** Delete a file. */
export async function deleteFile(opts: { path: string; message: string }): Promise<void> {
  const o = client();
  const existing = await readFile(opts.path);
  if (!existing) return;
  await o.repos.deleteFile({
    owner,
    repo,
    branch,
    path: opts.path,
    message: opts.message,
    sha: existing.sha,
    committer: { name: "rehanmollick", email: "rehanmollick07@gmail.com" },
    author: { name: "rehanmollick", email: "rehanmollick07@gmail.com" },
  });
}
