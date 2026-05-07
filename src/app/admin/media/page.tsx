// /admin/media — visual scaffold per .spec/13 §C.10. Wires to Vercel Blob
// in Phase D2 (post-PR). For now displays project slide labels as the seed.

import { projects } from "@/data/projects";

export default function MediaLibrary() {
  const all: { project: string; label: string }[] = [];
  projects.forEach((p) => {
    p.slides.forEach((s) => {
      all.push({
        project: p.title,
        label: "label" in s ? s.label : "media",
      });
    });
  });

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
        Media Library
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
        {all.length} FILES · DRAG TO REORDER · CLICK TO ATTACH TO A STATION
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
          placeholder="> filter by project, filename…"
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
        <button
          className="btn font-mono"
          style={{
            fontSize: 11,
            padding: "8px 14px",
            border: "1px solid var(--accent)",
            background: "var(--accent)",
            color: "#050505",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          ⇪ Upload
        </button>
      </div>

      <div
        className="media-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {all.map((m, i) => (
          <div
            key={i}
            className="media-thumb font-mono"
            style={{
              position: "relative",
              aspectRatio: "1",
              background:
                "repeating-linear-gradient(45deg,#1a1408 0 10px,#241c0b 10px 20px)",
              border: "1px solid #2a2010",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6a5a30",
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: 12,
              textAlign: "center",
            }}
          >
            <span
              className="order-badge font-pixel"
              style={{
                position: "absolute",
                bottom: 4,
                left: 4,
                fontSize: 10,
                background: "var(--accent)",
                color: "#050505",
                padding: "1px 5px",
                letterSpacing: "0.1em",
              }}
            >
              {m.project}
            </span>
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
}
