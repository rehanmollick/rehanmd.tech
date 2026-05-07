"use client";

// /admin/about config form. Edits bio, tagline, widgets, photos, facts, links.
// Saves to Vercel KV via PUT /api/admin/about; the public bulletin reads from
// the same KV namespace so changes go live within the revalidate TTL.

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutConfig, AboutPhoto, AboutLink } from "@/lib/about";
import { showToast } from "./Toast";

interface Props {
  initial: AboutConfig;
}

export default function AboutConfigForm({ initial }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  // Local state mirrors only the fields editable in this form.
  const [bio, setBio] = useState(initial.bio);
  const [tagline, setTagline] = useState(initial.tagline);
  const [afk, setAfk] = useState(initial.afk);
  const [stack, setStack] = useState(initial.stack.join(", "));

  const [currentBig, setCurrentBig] = useState(initial.widgets.currentProject.big);
  const [currentSmall, setCurrentSmall] = useState(
    initial.widgets.currentProject.small ?? "",
  );
  const [nowPlayingBig, setNowPlayingBig] = useState(initial.widgets.nowPlaying.big);
  const [obsessedBig, setObsessedBig] = useState(initial.widgets.obsessed.big);
  const [obsessedSmall, setObsessedSmall] = useState(
    initial.widgets.obsessed.small ?? "",
  );
  const [winBig, setWinBig] = useState(initial.widgets.win.big);
  const [winSmall, setWinSmall] = useState(initial.widgets.win.small ?? "");

  const [photos, setPhotos] = useState<AboutPhoto[]>(initial.photos);
  const [facts, setFacts] = useState<string[]>(initial.facts);
  const [links, setLinks] = useState<AboutLink[]>(
    initial.links.length > 0 ? initial.links : [{ label: "", href: "" }],
  );

  async function handleSave() {
    if (busy) return;
    setBusy(true);

    const next: Partial<AboutConfig> = {
      bio: bio.trim(),
      tagline: tagline.trim(),
      afk: afk.trim(),
      stack: stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      widgets: {
        ...initial.widgets,
        currentProject: {
          ...initial.widgets.currentProject,
          big: currentBig.trim(),
          small: currentSmall.trim() || undefined,
        },
        nowPlaying: {
          ...initial.widgets.nowPlaying,
          big: nowPlayingBig.trim(),
        },
        obsessed: {
          ...initial.widgets.obsessed,
          big: obsessedBig.trim(),
          small: obsessedSmall.trim() || undefined,
        },
        win: {
          ...initial.widgets.win,
          big: winBig.trim(),
          small: winSmall.trim() || undefined,
        },
      },
      photos: photos.map((p) => ({
        src: p.src?.trim() || null,
        caption: p.caption.trim(),
      })),
      facts: facts.map((f) => f.trim()).filter(Boolean),
      links: links
        .map((l) => ({ label: l.label.trim(), href: l.href.trim() }))
        .filter((l) => l.label && l.href),
    };

    try {
      const r = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const data = await r.json();
      if (!r.ok) {
        showToast(data.error || "Save failed", "error");
        return;
      }
      showToast("About config saved · revalidating /");
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    } finally {
      setBusy(false);
    }
  }

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
        About · Bulletin Config
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
        EDIT THE BULLETIN MODAL — BIO · WIDGETS · PHOTOS · FACTS · LINKS · SAVES TO KV
      </div>

      <div
        style={{
          maxWidth: 720,
          background: "var(--bg-primary)",
          border: "1px solid #1d1d1d",
          padding: 24,
        }}
      >
        <Field label="Tagline" value={tagline} onChange={setTagline} />
        <Field label="Bio" textarea value={bio} onChange={setBio} />
        <Field label="AFK" textarea value={afk} onChange={setAfk} />
        <Field
          label="Stack chips"
          hint="Comma-separated. Renders as the cream-pill badges in the bulletin's “The Stack” section."
          value={stack}
          onChange={setStack}
        />

        <Section title="▸ Now playing">
          <Field
            label="◉ Currently working on — main"
            value={currentBig}
            onChange={setCurrentBig}
          />
          <Field
            label="◉ Currently working on — sub"
            value={currentSmall}
            onChange={setCurrentSmall}
          />
          <Field
            label="♫ Now playing — song · artist"
            value={nowPlayingBig}
            onChange={setNowPlayingBig}
          />
          <Field
            label="★ Currently obsessed — main"
            value={obsessedBig}
            onChange={setObsessedBig}
          />
          <Field
            label="★ Currently obsessed — sub"
            value={obsessedSmall}
            onChange={setObsessedSmall}
          />
          <Field
            label="▣ Recent win — main"
            value={winBig}
            onChange={setWinBig}
          />
          <Field
            label="▣ Recent win — sub"
            value={winSmall}
            onChange={setWinSmall}
          />
        </Section>

        <Section title="▸ Photo strip (4 tiles)">
          {photos.map((photo, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <Field
                label={`Photo ${String(i + 1).padStart(2, "0")} — Image URL (Blob)`}
                value={photo.src ?? ""}
                onChange={(v) =>
                  setPhotos((arr) => {
                    const next = [...arr];
                    next[i] = { ...next[i], src: v };
                    return next;
                  })
                }
                placeholder="https://blob.vercel-storage.com/…"
              />
              <Field
                label={`Photo ${String(i + 1).padStart(2, "0")} — Caption`}
                value={photo.caption}
                onChange={(v) =>
                  setPhotos((arr) => {
                    const next = [...arr];
                    next[i] = { ...next[i], caption: v };
                    return next;
                  })
                }
              />
            </div>
          ))}
        </Section>

        <Section title="▸ Facts (▸ FIELD NOTES list)">
          {facts.map((fact, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 36px",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <input
                value={fact}
                onChange={(e) =>
                  setFacts((arr) => {
                    const next = [...arr];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                style={inputStyle()}
              />
              <button
                type="button"
                onClick={() =>
                  setFacts((arr) => arr.filter((_, idx) => idx !== i))
                }
                style={removeBtn()}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFacts((arr) => [...arr, ""])}
            style={addBtn()}
          >
            ＋ Add fact
          </button>
        </Section>

        <Section title="▸ Contact links (THE LINKS row)">
          {links.map((link, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr 36px",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <input
                placeholder="Label (e.g. EMAIL)"
                value={link.label}
                onChange={(e) =>
                  setLinks((arr) => {
                    const next = [...arr];
                    next[i] = { ...next[i], label: e.target.value };
                    return next;
                  })
                }
                style={inputStyle()}
              />
              <input
                placeholder="https:// or mailto:"
                value={link.href}
                onChange={(e) =>
                  setLinks((arr) => {
                    const next = [...arr];
                    next[i] = { ...next[i], href: e.target.value };
                    return next;
                  })
                }
                style={inputStyle()}
              />
              <button
                type="button"
                onClick={() =>
                  setLinks((arr) => arr.filter((_, idx) => idx !== i))
                }
                style={removeBtn()}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setLinks((arr) => [...arr, { label: "", href: "" }])}
            style={addBtn()}
          >
            ＋ Add link
          </button>
        </Section>

        <div
          className="save-bar"
          style={{
            position: "sticky",
            bottom: 0,
            background:
              "linear-gradient(to top, var(--page-outer) 60%, transparent)",
            padding: "14px 0 0",
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="btn primary font-mono"
            style={{
              fontSize: 11,
              padding: "10px 16px",
              border: "1px solid var(--accent)",
              background: "var(--accent)",
              color: "#050505",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {busy ? "▸ SAVING…" : "▸ SAVE TO KV"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        marginTop: 28,
        paddingTop: 16,
        borderTop: "1px dashed #1d1d1d",
      }}
    >
      <h3
        className="font-pixel"
        style={{
          fontSize: 16,
          color: "var(--accent-light)",
          margin: "0 0 14px",
          letterSpacing: "0.1em",
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div className="field" style={{ marginBottom: 14 }}>
      <label
        className="font-mono"
        style={{
          display: "block",
          fontSize: 10,
          color: "var(--text-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...inputStyle(), minHeight: 80, resize: "vertical" }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inputStyle()}
        />
      )}
      {hint && (
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            marginTop: 4,
            letterSpacing: "0.1em",
          }}
        >
          {hint}
        </div>
      )}
    </div>
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

function removeBtn(): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    border: "1px solid #4a1010",
    color: "#ff6a50",
    background: "transparent",
    fontSize: 16,
    cursor: "pointer",
  };
}

function addBtn(): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono), monospace",
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
