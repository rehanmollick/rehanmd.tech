"use client";

import { useState } from "react";

/**
 * Brain-dump dispatch composer.
 * Paste anything → /api/admin/compose runs Claude → preview → publish commits MDX.
 */
export default function NewDispatchPage() {
  const [dump, setDump] = useState("");
  const [draft, setDraft] = useState<{
    slug: string;
    headline: string;
    dek?: string;
    dateline?: string;
    tags?: string[];
    body: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [published, setPublished] = useState<string | null>(null);

  async function compose() {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brainDump: dump }),
      });
      const data = await r.json();
      if (!r.ok) {
        setErr(data.error || "Compose failed");
      } else {
        setDraft(data);
      }
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!draft) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await r.json();
      if (!r.ok) {
        setErr(data.error || "Publish failed");
      } else {
        setPublished(data.path);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 text-text-primary">
      <h1 className="text-3xl font-bold mb-2">New Dispatch</h1>
      <p className="text-text-muted text-sm mb-6">
        Paste a transcript, bullet points, or stream-of-consciousness. Claude shapes it into a dispatch.
      </p>

      <textarea
        value={dump}
        onChange={(e) => setDump(e.target.value)}
        rows={12}
        placeholder="Brain dump goes here…"
        className="w-full bg-bg-secondary border border-white/10 p-4 font-mono text-sm rounded"
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={compose}
          disabled={busy || !dump.trim()}
          className="px-4 py-2 bg-accent text-white tracking-widest uppercase text-xs disabled:opacity-50"
        >
          {busy ? "Composing…" : "Compose Dispatch"}
        </button>
      </div>

      {err && <p className="mt-4 text-red-400 text-sm">{err}</p>}
      {published && (
        <p className="mt-4 text-green-400 text-sm">
          Published to <code>{published}</code>. Vercel will redeploy shortly.
        </p>
      )}

      {draft && (
        <section className="mt-8 border border-accent/40 p-6 bg-bg-secondary">
          <input
            value={draft.headline}
            onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
            className="w-full text-3xl font-black bg-transparent border-b border-white/10 mb-2 focus:outline-none"
          />
          <input
            value={draft.dek || ""}
            onChange={(e) => setDraft({ ...draft, dek: e.target.value })}
            className="w-full text-sm italic bg-transparent border-b border-white/10 mb-4 focus:outline-none"
          />
          <div className="flex gap-3 mb-4 text-xs font-mono">
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className="flex-1 bg-transparent border border-white/10 px-2 py-1"
              placeholder="slug"
            />
            <input
              value={(draft.tags || []).join(", ")}
              onChange={(e) =>
                setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()) })
              }
              className="flex-1 bg-transparent border border-white/10 px-2 py-1"
              placeholder="tags, comma-separated"
            />
          </div>
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            rows={20}
            className="w-full bg-bg-primary/50 border border-white/10 p-3 font-mono text-sm"
          />
          <div className="mt-4 flex gap-3">
            <button
              onClick={publish}
              disabled={busy}
              className="px-4 py-2 bg-accent text-white tracking-widest uppercase text-xs"
            >
              Publish (commit MDX)
            </button>
            <button
              onClick={() => setDraft(null)}
              className="px-4 py-2 border border-white/20 text-xs tracking-widest uppercase"
            >
              Discard
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
