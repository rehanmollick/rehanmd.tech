// /admin/dispatches list. Verbatim from prototype/app.js:676–700 per .spec/13 §C.10.

import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

function fmt(iso: string): string {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

export default function DispatchesList() {
  const posts = getAllPosts();
  return (
    <div>
      <h2
        className="font-pixel"
        style={{
          fontSize: 32,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "0.02em",
        }}
      >
        Dispatches · Wall
      </h2>
      <div
        className="page-sub font-mono"
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          letterSpacing: "0.15em",
          marginTop: 4,
          marginBottom: 20,
          textTransform: "uppercase",
        }}
      >
        {posts.length} POSTS ON THE WALL · ORGANIC LAYOUT · NEW POSTS PIN
        THEMSELVES TO THE FIRST OPEN SPOT
      </div>

      <div
        className="admin-toolbar"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          className="admin-search font-mono"
          placeholder="> search dispatches…"
          style={{
            flex: 1,
            minWidth: 220,
            background: "var(--bg-primary)",
            border: "1px solid #1d1d1d",
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--text-primary)",
          }}
        />
        <Link
          href="/admin/dispatches/new"
          className="btn font-mono"
          style={{
            fontSize: 11,
            padding: "8px 14px",
            border: "1px solid var(--accent)",
            background: "var(--accent)",
            color: "#050505",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          ＋ New Dispatch
        </Link>
      </div>

      <div
        className="admin-list"
        style={{ border: "1px solid #1d1d1d", background: "var(--bg-primary)" }}
      >
        {posts.map((p) => (
          <div
            key={p.slug}
            className="admin-row"
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 120px 120px 140px",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #1d1d1d",
              gap: 14,
            }}
          >
            <div
              className="thumb font-mono"
              style={{
                width: 48,
                height: 48,
                background:
                  "repeating-linear-gradient(45deg,#1a1408 0 8px,#241c0b 8px 16px)",
                border: "1px solid #2a2010",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6a5a30",
                fontSize: 10,
              }}
            >
              DOC
            </div>
            <div className="meta">
              <div
                className="t font-pixel"
                style={{ fontSize: 18, color: "var(--text-primary)" }}
              >
                {p.title}
              </div>
              <div
                className="s font-mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-muted)",
                  letterSpacing: "0.1em",
                  marginTop: 2,
                }}
              >
                {p.tags.join(" · ")} · {p.readTime} min read
              </div>
            </div>
            <div
              className="date font-mono"
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                letterSpacing: "0.1em",
              }}
            >
              {fmt(p.date)}
            </div>
            <div>
              <span
                className="status published font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  border: "1px solid #1a4a1a",
                  color: "#6ae06a",
                  background: "rgba(80,180,80,.08)",
                }}
              >
                Pinned
              </span>
            </div>
            <div
              className="actions"
              style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}
            >
              <Link
                href={`/blog/${p.slug}`}
                className="btn font-mono"
                style={miniBtn()}
              >
                View
              </Link>
              <button className="btn danger font-mono" style={miniBtn(true)}>
                Unpin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function miniBtn(danger = false): React.CSSProperties {
  return {
    padding: "5px 10px",
    fontSize: 10,
    border: `1px solid ${danger ? "#4a1010" : "#2a2a2a"}`,
    color: danger ? "#ff6a50" : "var(--text-secondary)",
    background: "transparent",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
  };
}
