"use client";

// Brain-dump dispatch composer. Layout matches the prototype's
// "Pin a New Dispatch" form (see .spec/13 §C.10): two-column with form-main
// + sidebar form-cards (Paper Style, Meta, Cover Image), sticky save bar.
// Compose endpoint at /api/admin/compose (preserved). Publish at /api/admin/posts.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/admin/Toast";

type Vibe = "casual" | "technical" | "reflective";

interface Draft {
  slug: string;
  headline: string;
  dek?: string;
  dateline?: string;
  tags?: string[];
  body: string;
}

export default function NewDispatchPage() {
  const router = useRouter();
  const [dump, setDump] = useState("");
  const [vibe, setVibe] = useState<Vibe>("casual");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  async function compose() {
    if (busy || dump.trim().length < 30) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brainDump: dump, vibe }),
      });
      const data = await r.json();
      if (!r.ok) {
        showToast(data.error || "Compose failed", "error");
        return;
      }
      setDraft(data);
      showToast("Draft composed · review and publish");
    } catch (e) {
      console.error(e);
      showToast("Network error", "error");
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!draft || busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await r.json();
      if (!r.ok) {
        showToast(data.error || "Publish failed", "error");
        return;
      }
      const sha = (data.commitSha || "").slice(0, 7);
      showToast(`Pinned · ${draft.headline} · ${sha}`);
      router.push("/admin/dispatches");
      router.refresh();
    } catch (e) {
      console.error(e);
      showToast("Network error", "error");
    } finally {
      setBusy(false);
    }
  }

  const phase: "compose" | "draft" = draft ? "draft" : "compose";

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
        Pin a New Dispatch
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
        WRITE FIRST · POLISH LATER · THE WALL HAS ROOM
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 24,
        }}
      >
        <div
          className="form-main"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid #1d1d1d",
            padding: 24,
            minWidth: 0,
          }}
        >
          {phase === "compose" ? (
            <>
              <Label>Brain dump · paste anything</Label>
              <textarea
                value={dump}
                onChange={(e) => setDump(e.target.value)}
                rows={14}
                placeholder="Bullet points, half-sentences, links — whatever. Claude turns it into a draft."
                style={{
                  ...inputStyle(),
                  fontSize: 14,
                  lineHeight: 1.5,
                  minHeight: 280,
                  resize: "vertical",
                }}
              />
              <div
                className="font-mono"
                style={{
                  marginTop: 6,
                  fontSize: 10,
                  color: dump.trim().length < 30
                    ? "#ff6a50"
                    : "var(--text-muted)",
                  letterSpacing: "0.1em",
                }}
              >
                {dump.trim().length < 30
                  ? `${30 - dump.trim().length} more chars needed before compose`
                  : `${dump.trim().length} chars · ready to compose`}
              </div>

              <Label style={{ marginTop: 18 }}>Vibe</Label>
              <div style={{ display: "flex", gap: 6 }}>
                {(["casual", "technical", "reflective"] as Vibe[]).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVibe(v)}
                    className="font-mono"
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      border: `1px solid ${vibe === v ? "var(--accent)" : "#2a2a2a"}`,
                      background:
                        vibe === v ? "rgba(191,87,0,.1)" : "transparent",
                      color:
                        vibe === v
                          ? "var(--accent-light)"
                          : "var(--text-secondary)",
                      cursor: "pointer",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <DraftEditor draft={draft!} setDraft={setDraft} />
          )}
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormCard title="▸ Paper Style">
            <Switch label="Cream paper" defaultChecked />
            <Switch label="Masking tape" defaultChecked />
            <Switch label="Aged/stained" />
          </FormCard>

          <FormCard title="▸ Meta">
            <Label>Tags (comma separated)</Label>
            <input
              value={draft?.tags?.join(", ") ?? ""}
              onChange={(e) =>
                draft &&
                setDraft({
                  ...draft,
                  tags: e.target.value.split(",").map((t) => t.trim()),
                })
              }
              placeholder="meta, rant, postmortem"
              style={inputStyle()}
              disabled={!draft}
            />
          </FormCard>

          <FormCard title="▸ Cover Image">
            <label
              className="font-mono"
              style={{
                display: "block",
                cursor: "pointer",
                border: "2px dashed #3a2a10",
                background: "rgba(191,87,0,.03)",
                padding: 24,
                textAlign: "center",
                fontSize: 11,
                color: "var(--text-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  color: "var(--accent)",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                ⇪
              </span>
              UPLOAD COVER
              <input type="file" accept="image/*" style={{ display: "none" }} />
            </label>
          </FormCard>
        </aside>

        <div
          className="save-bar"
          style={{
            position: "sticky",
            bottom: 0,
            background:
              "linear-gradient(to top, var(--page-outer) 60%, transparent)",
            padding: "14px 0",
            marginTop: 20,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            zIndex: 5,
            gridColumn: "1 / -1",
          }}
        >
          {phase === "compose" ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/admin/dispatches")}
                disabled={busy}
                className="font-mono"
                style={ghostBtn()}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={compose}
                disabled={busy || dump.trim().length < 30}
                className="font-mono"
                style={primaryBtn()}
              >
                {busy ? "▸ COMPOSING…" : "▸ ⚡ Compose Draft"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDraft(null)}
                disabled={busy}
                className="font-mono"
                style={ghostBtn()}
              >
                Discard draft
              </button>
              <button
                type="button"
                onClick={compose}
                disabled={busy}
                className="font-mono"
                style={ghostBtn()}
              >
                Regenerate
              </button>
              <button
                type="button"
                onClick={publish}
                disabled={busy}
                className="font-mono"
                style={primaryBtn()}
              >
                {busy ? "▸ COMMITTING…" : "▸ Pin to wall"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DraftEditor({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  return (
    <>
      <Label>Headline</Label>
      <input
        value={draft.headline}
        onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
        style={{
          ...inputStyle(),
          fontFamily: "var(--font-serif), 'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
        }}
      />

      <Label style={{ marginTop: 14 }}>Dek (sub-headline)</Label>
      <input
        value={draft.dek ?? ""}
        onChange={(e) => setDraft({ ...draft, dek: e.target.value })}
        style={{
          ...inputStyle(),
          fontFamily: "var(--font-serif), 'Playfair Display', serif",
          fontStyle: "italic",
          fontSize: 14,
        }}
      />

      <Label style={{ marginTop: 14 }}>Slug</Label>
      <input
        value={draft.slug}
        onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
        style={inputStyle()}
      />

      <Label style={{ marginTop: 14 }}>Body (MDX)</Label>
      <textarea
        value={draft.body}
        onChange={(e) => setDraft({ ...draft, body: e.target.value })}
        rows={20}
        style={{
          ...inputStyle(),
          fontFamily: "var(--font-mono), monospace",
          fontSize: 13,
          minHeight: 380,
          resize: "vertical",
          lineHeight: 1.6,
        }}
      />
    </>
  );
}

function Label({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <label
      className="font-mono"
      style={{
        display: "block",
        fontSize: 10,
        color: "var(--text-muted)",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </label>
  );
}

function FormCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid #1d1d1d",
        padding: 18,
      }}
    >
      <h3
        className="font-pixel"
        style={{
          fontSize: 18,
          color: "var(--accent-light)",
          margin: "0 0 10px",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function Switch({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label
      className="font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontSize: 11,
        color: "var(--text-secondary)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "pointer",
        marginBottom: 8,
      }}
    >
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: 34,
          height: 18,
          borderRadius: 9,
          background: defaultChecked ? "var(--accent-dim)" : "#2a2a2a",
          position: "relative",
          display: "inline-block",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 2,
            left: defaultChecked ? 18 : 2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: defaultChecked ? "var(--accent-light)" : "#555",
            transition: "all .2s",
          }}
        />
      </span>
      {label}
    </label>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    background: "var(--page-outer)",
    border: "1px solid #2a2a2a",
    padding: "10px 12px",
    fontFamily: "var(--font-mono), monospace",
    fontSize: 13,
    color: "var(--text-primary)",
  };
}

function ghostBtn(): React.CSSProperties {
  return {
    fontSize: 11,
    padding: "8px 14px",
    border: "1px solid #2a2a2a",
    color: "var(--text-secondary)",
    background: "transparent",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  };
}

function primaryBtn(): React.CSSProperties {
  return {
    fontSize: 11,
    padding: "8px 14px",
    border: "1px solid var(--accent)",
    background: "var(--accent)",
    color: "#050505",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    cursor: "pointer",
  };
}
