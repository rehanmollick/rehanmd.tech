"use client";

// Project edit form. Save flow: validate + POST/PUT to /api/admin/projects;
// on success, /api/admin/projects writes src/data/projects.ts back to GitHub
// via Octokit and revalidates the affected paths.

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import { showToast } from "./Toast";

interface Props {
  project?: Project;
}

export default function ProjectForm({ project }: Props) {
  const router = useRouter();
  const isEdit = Boolean(project?.id);
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(project?.title ?? "");
  const [stationName, setStationName] = useState(project?.stationName ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    const techNames = fd.getAll("techName").map((v) => String(v));
    const techReasons = fd.getAll("techReason").map((v) => String(v));
    const techStack = techNames
      .map((name, i) => ({ name: name.trim(), reason: (techReasons[i] || "").trim() }))
      .filter((t) => t.name);

    const payload = {
      id: String(fd.get("id") || project?.id || "").trim() || undefined,
      title: String(fd.get("title") || "").trim(),
      date: String(fd.get("date") || "").trim(),
      dateDisplay: String(fd.get("dateDisplay") || "").trim(),
      stationName: String(fd.get("stationName") || "").trim(),
      description: String(fd.get("description") || "").trim(),
      context: String(fd.get("context") || "").trim() || null,
      repoUrl: String(fd.get("repoUrl") || "").trim() || null,
      liveUrl: String(fd.get("liveUrl") || "").trim() || null,
      tags: String(fd.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      featured: fd.get("featured") === "on",
      techStack,
      slides: project?.slides ?? [],
    };

    try {
      const url = isEdit
        ? `/api/admin/projects/${project!.id}`
        : "/api/admin/projects";
      const r = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      if (!r.ok) {
        showToast(data.error || "Save failed", "error");
        return;
      }
      const sha = (data.commitSha || "").slice(0, 7);
      showToast(
        isEdit
          ? `Saved · ${data.project?.title} · ${sha}`
          : `Added to line · ${data.project?.title} · ${sha}`,
      );
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!isEdit || !project) return;
    if (!confirm(`Delete "${project.title}" from The Line?`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      const data = await r.json();
      if (!r.ok) {
        showToast(data.error || "Delete failed", "error");
        return;
      }
      const sha = (data.commitSha || "").slice(0, 7);
      showToast(`Deleted · ${project.title} · ${sha}`);
      router.push("/admin/projects");
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
        {isEdit ? "Edit Station" : "New Station"}
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
        {isEdit
          ? `Station — ${project?.title}`
          : "ADD A NEW STOP TO THE LINE. REQUIRED FIELDS MARKED * — EVERYTHING ELSE IS OPTIONAL AND WILL BE OMITTED IF BLANK."}
      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 24,
          marginTop: 14,
        }}
      >
        <div
          className="form-main"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid #1d1d1d",
            padding: 24,
          }}
        >
          <Field
            label="Project title"
            required
            placeholder="e.g. GridPulse"
            value={title}
            onChange={setTitle}
            name="title"
          />

          <div className="field-row" style={fieldRow()}>
            <Field
              label="Date"
              required
              type="date"
              defaultValue={project?.date?.substring(0, 10) ?? ""}
              hint="Used for sorting on the line (newest at top)"
              name="date"
            />
            <Field
              label="Date display"
              optional="auto if blank"
              defaultValue={project?.dateDisplay ?? ""}
              placeholder="e.g. January 2026"
              name="dateDisplay"
            />
          </div>

          <Field
            label="Station name"
            optional="optional · shown on station plate"
            value={stationName}
            onChange={setStationName}
            placeholder="e.g. GridPulse Station · defaults to project title"
            name="stationName"
          />

          <Field
            label="Description"
            required
            textarea
            defaultValue={project?.description ?? ""}
            placeholder="What does it do? Who's it for? Why build it?"
            name="description"
          />

          <Field
            label="Context"
            optional="optional · hackathon, internship, client, award"
            defaultValue={project?.context ?? ""}
            placeholder="e.g. HackTAMU 2026"
            name="context"
          />

          <div className="field-row" style={fieldRow()}>
            <Field
              label="GitHub repo"
              optional="optional"
              defaultValue={project?.repoUrl ?? ""}
              placeholder="https://github.com/…"
              name="repoUrl"
            />
            <Field
              label="Live URL"
              optional="optional"
              defaultValue={project?.liveUrl ?? ""}
              placeholder="https://…"
              name="liveUrl"
            />
          </div>

          <div className="field" style={{ marginBottom: 16 }}>
            <Label>
              Tech stack <span style={{ color: "var(--accent-light)" }}>*</span>{" "}
              <span style={optStyle()}>— add name + reason for using it</span>
            </Label>
            <div
              className="tech-builder"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              {(project?.techStack ?? [{ name: "", reason: "" }]).map((t, i) => (
                <TechRow key={i} name={t.name} reason={t.reason} />
              ))}
            </div>
            <button
              type="button"
              id="add-tech"
              onClick={() => {
                const builder = document.querySelector(".tech-builder");
                if (!builder) return;
                const wrap = document.createElement("div");
                wrap.className = "tech-row";
                wrap.style.cssText =
                  "display:grid; grid-template-columns:150px 1fr 36px; gap:8px; align-items:start;";
                wrap.innerHTML = `
                  <input name="techName" placeholder="Name (e.g. Next.js)" style="width:100%; background:var(--page-outer); border:1px solid #2a2a2a; padding:8px 10px; font-family:var(--font-mono),monospace; font-size:13px; color:var(--text-primary)" />
                  <textarea name="techReason" placeholder="Why this tech?" style="width:100%; background:var(--page-outer); border:1px solid #2a2a2a; padding:8px 10px; font-family:var(--font-mono),monospace; font-size:12px; color:var(--text-primary); min-height:60px; resize:vertical; line-height:1.5"></textarea>
                  <button type="button" data-rm style="width:36px; height:36px; border:1px solid #4a1010; color:#ff6a50; display:flex; align-items:center; justify-content:center; font-size:16px; background:transparent; cursor:pointer;">✕</button>
                `;
                wrap
                  .querySelector("[data-rm]")
                  ?.addEventListener("click", () => wrap.remove());
                builder.appendChild(wrap);
              }}
              className="btn font-mono"
              style={{
                marginTop: 8,
                fontSize: 11,
                padding: "8px 14px",
                border: "1px solid #2a2a2a",
                color: "var(--text-secondary)",
                background: "transparent",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              ＋ Add tech
            </button>
          </div>

          <Field
            label="Tags"
            optional="optional · comma separated"
            defaultValue={project?.tags?.join(", ") ?? ""}
            placeholder="ai, hackathon, web3…"
            name="tags"
          />
        </div>

        <aside
          className="form-side"
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <FormCard title="▸ Media">
            <p
              className="font-mono"
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                margin: "0 0 10px",
              }}
            >
              Drag or click to upload images, GIFs, or videos. These show in the
              project&apos;s carousel and lightbox.
            </p>
            <label
              className="media-box font-mono"
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
                className="up-icon"
                style={{
                  fontSize: 32,
                  color: "var(--accent)",
                  marginBottom: 8,
                  display: "block",
                }}
              >
                ⇪
              </span>
              DROP MEDIA HERE
              <div style={{ marginTop: 6, fontSize: 9, opacity: 0.7 }}>
                OR CLICK TO BROWSE · PNG JPG GIF MP4
              </div>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                style={{ display: "none" }}
              />
            </label>
          </FormCard>

          <FormCard title="▸ Visibility">
            <SwitchRow
              defaultChecked={project?.featured}
              label="Featured on line"
              name="featured"
            />
            <SwitchRow defaultChecked label="Published" />
            <p
              className="font-mono"
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
                marginTop: 10,
              }}
            >
              Unpublished stations are hidden from the public line.
            </p>
          </FormCard>

          <FormCard title="▸ Station Sign Preview">
            <div
              style={{
                border: "2px solid #2a2a2a",
                padding: 4,
                background: "#000",
                marginTop: 6,
              }}
            >
              <div
                className="font-pixel"
                style={{
                  background: "#000",
                  padding: "4px 10px",
                  fontSize: 13,
                  color: "var(--accent-light)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textShadow: "0 0 6px rgba(255,140,50,.5)",
                }}
              >
                {stationName || title || "PREVIEW"}
              </div>
            </div>
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
          <button
            type="button"
            className="btn font-mono"
            style={ghostBtn()}
            onClick={() => router.push("/admin/projects")}
            disabled={busy}
          >
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              className="btn danger font-mono"
              style={dangerBtn()}
              onClick={handleDelete}
              disabled={busy}
            >
              Delete station
            </button>
          )}
          <button
            type="submit"
            className="btn primary font-mono"
            style={primaryBtn()}
            disabled={busy}
          >
            {busy
              ? "▸ COMMITTING…"
              : `▸ ${isEdit ? "Save changes" : "Add to line"}`}
          </button>
        </div>
      </form>
    </div>
  );
}

function fieldRow(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
    marginBottom: 16,
  };
}

function Field({
  label,
  required,
  optional,
  textarea,
  hint,
  type = "text",
  placeholder,
  defaultValue,
  value,
  onChange,
  name,
}: {
  label: string;
  required?: boolean;
  optional?: string;
  textarea?: boolean;
  hint?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (v: string) => void;
  name?: string;
}) {
  return (
    <div className="field" style={{ marginBottom: 16 }}>
      <Label>
        {label}{" "}
        {required && <span style={{ color: "var(--accent-light)" }}>*</span>}
        {optional && <span style={optStyle()}>({optional})</span>}
      </Label>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          style={inputStyle({ textarea: true })}
          rows={4}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          style={inputStyle()}
        />
      )}
      {hint && (
        <div
          className="hint font-mono"
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

function Label({ children }: { children: React.ReactNode }) {
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
      }}
    >
      {children}
    </label>
  );
}

function inputStyle(opts: { textarea?: boolean } = {}): React.CSSProperties {
  return {
    width: "100%",
    background: "var(--page-outer)",
    border: "1px solid #2a2a2a",
    padding: "10px 12px",
    fontFamily: "var(--font-mono), monospace",
    fontSize: 13,
    color: "var(--text-primary)",
    minHeight: opts.textarea ? 100 : undefined,
    resize: opts.textarea ? "vertical" : undefined,
    lineHeight: opts.textarea ? 1.5 : undefined,
  };
}

function optStyle(): React.CSSProperties {
  return {
    color: "#555",
    fontWeight: 400,
    textTransform: "none",
    letterSpacing: "0.1em",
  };
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
      className="form-card"
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

function TechRow({ name, reason }: { name: string; reason: string }) {
  return (
    <div
      className="tech-row"
      style={{
        display: "grid",
        gridTemplateColumns: "150px 1fr 36px",
        gap: 8,
        alignItems: "start",
      }}
    >
      <input
        name="techName"
        placeholder="Name (e.g. Next.js)"
        defaultValue={name}
        style={{ ...inputStyle(), padding: "8px 10px" }}
      />
      <textarea
        name="techReason"
        placeholder="Why this tech?"
        defaultValue={reason}
        style={{
          ...inputStyle({ textarea: true }),
          minHeight: 60,
          padding: "8px 10px",
          fontSize: 12,
        }}
      />
      <button
        type="button"
        className="remove"
        onClick={(e) => {
          e.currentTarget.closest(".tech-row")?.remove();
        }}
        style={{
          width: 36,
          height: 36,
          border: "1px solid #4a1010",
          color: "#ff6a50",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          background: "transparent",
        }}
      >
        ✕
      </button>
    </div>
  );
}

function SwitchRow({
  label,
  defaultChecked,
  name,
}: {
  label: string;
  defaultChecked?: boolean;
  name?: string;
}) {
  return (
    <label
      className="switch font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontSize: 11,
        color: "var(--text-secondary)",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "pointer",
        marginBottom: 10,
        marginRight: 16,
      }}
    >
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        style={{ display: "none" }}
      />
      <span
        className="track"
        style={{
          width: 34,
          height: 18,
          borderRadius: 9,
          background: defaultChecked ? "var(--accent-dim)" : "#2a2a2a",
          position: "relative",
          transition: "background .2s",
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

function ghostBtn(): React.CSSProperties {
  return {
    fontSize: 11,
    padding: "8px 14px",
    border: "1px solid #2a2a2a",
    color: "var(--text-secondary)",
    background: "transparent",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  };
}

function dangerBtn(): React.CSSProperties {
  return {
    fontSize: 11,
    padding: "8px 14px",
    border: "1px solid #4a1010",
    color: "#ff6a50",
    background: "transparent",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
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
  };
}
