"use client";

// Vercel Blob-backed media library. Shows existing blobs in a tile grid;
// upload via drop-zone; click tile → COPY URL or DELETE.

import { useEffect, useRef, useState } from "react";
import { showToast } from "./Toast";

interface BlobItem {
  pathname: string;
  url: string;
  size: number;
  uploadedAt: string;
  contentType?: string;
}

export default function MediaLibrary() {
  const [items, setItems] = useState<BlobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [uploads, setUploads] = useState<
    { id: number; name: string; status: "uploading" | "done" | "failed" }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/media");
      const data = await r.json();
      if (r.ok) setItems(data.items || []);
      else showToast(data.error || "Load failed", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newRows = Array.from(files).map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      status: "uploading" as const,
    }));
    setUploads((u) => [...u, ...newRows]);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("filename", file.name);
      try {
        const r = await fetch("/api/admin/media", { method: "POST", body: fd });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Upload failed");
        setUploads((u) =>
          u.map((row) =>
            row.name === file.name && row.status === "uploading"
              ? { ...row, status: "done" }
              : row,
          ),
        );
        showToast(`${file.name} → ${data.pathname}`);
      } catch (err) {
        console.error(err);
        setUploads((u) =>
          u.map((row) =>
            row.name === file.name && row.status === "uploading"
              ? { ...row, status: "failed" }
              : row,
          ),
        );
        showToast(`Upload failed: ${file.name}`, "error");
      }
    }
    refresh();
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      showToast("URL copied to clipboard");
    } catch {
      showToast("Couldn't copy URL", "error");
    }
  }

  async function handleDelete(item: BlobItem) {
    if (!confirm(`Delete ${item.pathname}? This is permanent.`)) return;
    try {
      const r = await fetch(
        `/api/admin/media?url=${encodeURIComponent(item.url)}`,
        { method: "DELETE" },
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Delete failed");
      showToast(`Deleted ${item.pathname}`);
      setItems((arr) => arr.filter((b) => b.pathname !== item.pathname));
    } catch (err) {
      console.error(err);
      showToast("Delete failed", "error");
    }
  }

  const visible = items.filter((b) => {
    if (filter === "all") return true;
    return (b.contentType || "").startsWith(filter);
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
        {items.length} FILES · STORED IN VERCEL BLOB
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
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="font-mono"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid #1d1d1d",
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--text-primary)",
          }}
        >
          <option value="all">ALL</option>
          <option value="image">IMAGE</option>
          <option value="video">VIDEO</option>
        </select>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
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
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm,video/quicktime"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div
        className="media-box font-mono"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: "2px dashed var(--accent-dim)",
          background: "rgba(191,87,0,.03)",
          padding: 24,
          textAlign: "center",
          fontSize: 11,
          color: "var(--text-muted)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        DROP IMAGES OR VIDEOS HERE · OR CLICK ⇪ UPLOAD · MAX 10MB
      </div>

      {uploads.length > 0 && (
        <div
          style={{
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {uploads.map((u) => (
            <div
              key={u.id}
              className="font-mono"
              style={{
                fontSize: 11,
                color:
                  u.status === "failed"
                    ? "#ff6b6b"
                    : u.status === "done"
                      ? "#6ae06a"
                      : "var(--text-secondary)",
                letterSpacing: "0.1em",
              }}
            >
              {u.status === "uploading"
                ? "↑"
                : u.status === "done"
                  ? "✓"
                  : "✕"}{" "}
              {u.name} · {u.status.toUpperCase()}
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: "0.15em",
          }}
        >
          LOADING…
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div
          className="font-mono"
          style={{
            border: "1px dashed #2a2a2a",
            padding: "40px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          MEDIA LIBRARY IS EMPTY · UPLOAD YOUR FIRST FILE
        </div>
      )}

      <div
        className="media-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
        }}
      >
        {visible.map((b) => (
          <Tile key={b.pathname} item={b} onCopy={handleCopy} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

function Tile({
  item,
  onCopy,
  onDelete,
}: {
  item: BlobItem;
  onCopy: (url: string) => void;
  onDelete: (item: BlobItem) => void;
}) {
  const isImage = (item.contentType || "").startsWith("image/");
  const isVideo = (item.contentType || "").startsWith("video/");
  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-primary)",
        border: "1px solid #1d1d1d",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          aspectRatio: "4 / 3",
          background: isImage
            ? `url(${item.url}) center / cover no-repeat, repeating-linear-gradient(45deg,#1a1408 0 10px,#241c0b 10px 20px)`
            : "repeating-linear-gradient(45deg,#1a1408 0 10px,#241c0b 10px 20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6a5a30",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        {isVideo && "VIDEO"}
        {!isImage && !isVideo && (item.contentType?.split("/")[0] || "FILE")}
      </div>
      <div
        className="font-mono"
        style={{ padding: "8px 10px", fontSize: 10 }}
      >
        <div
          style={{
            color: "var(--text-primary)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: "0.05em",
          }}
        >
          {item.pathname}
        </div>
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: 9,
            letterSpacing: "0.1em",
            marginTop: 2,
          }}
        >
          {formatBytes(item.size)}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => onCopy(item.url)}
            style={tileBtn()}
          >
            COPY URL
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            style={tileBtn(true)}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
}

function tileBtn(danger = false): React.CSSProperties {
  return {
    flex: 1,
    padding: "5px 8px",
    fontSize: 9,
    border: `1px solid ${danger ? "#4a1010" : "#2a2a2a"}`,
    background: "transparent",
    color: danger ? "#ff6a50" : "var(--text-secondary)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "var(--font-mono), monospace",
  };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
