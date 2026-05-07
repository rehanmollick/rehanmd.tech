// Admin dashboard. Verbatim copy + structure from prototype/app.js:465–497
// per .spec/13 §C.10. Stat cards, quick actions, recent activity.
//
// "Abandoned Branches" stat is preserved from the prototype even though
// BRANCHES = [] — it always reads 0, which is intentional.

import Link from "next/link";
import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/mdx";

function formatLongDate(d: Date): string {
  return d
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

export default function AdminDashboard() {
  const dispatches = getAllPosts();
  const totalSlides = projects.reduce((a, p) => a + (p.slides?.length || 0), 0);
  const abandonedBranches = 0; // BRANCHES = [] — see .spec §A.3

  return (
    <div style={{ padding: "0 4px" }}>
      <h2
        className="font-pixel"
        style={{
          fontSize: 32,
          color: "var(--text-primary)",
          margin: 0,
          letterSpacing: "0.02em",
        }}
      >
        Stationmaster&apos;s Desk
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
        WELCOME BACK, REHAN · {formatLongDate(new Date())}
      </div>

      <div
        className="admin-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <Stat n={projects.length} label="Stations" />
        <Stat n={dispatches.length} label="Dispatches" />
        <Stat n={totalSlides} label="Media Files" />
        <Stat n={abandonedBranches} label="Abandoned Branches" />
      </div>

      <Card title="▸ Quick Actions" mb={14}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          <BtnLink href="/admin/projects/new" primary>
            ＋ Add a Project
          </BtnLink>
          <BtnLink href="/admin/dispatches/new">＋ Pin a Dispatch</BtnLink>
          <BtnLink href="/admin/media">Upload Media</BtnLink>
          <BtnLink href="/" target="_blank">
            View Live Site ↗
          </BtnLink>
        </div>
      </Card>

      <Card title="▸ Recent Activity">
        <div
          className="font-mono"
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.9,
            marginTop: 6,
          }}
        >
          <Activity title="KARMEN PLAYGROUND" what="station added" when="March 15" />
          <Activity title="BUILDING REHANMD.TECH" what="dispatch pinned" when="March 31" />
          <Activity title="GRIDPULSE" what="station added" when="January 20" />
          <Activity title="FLIGHTSENSE" what="4 slides uploaded" when="January 12" />
        </div>
      </Card>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div
      className="stat"
      style={{
        background: "var(--bg-primary)",
        border: "1px solid #1d1d1d",
        padding: 14,
      }}
    >
      <div
        className="n font-pixel"
        style={{ fontSize: 34, color: "var(--accent-light)", lineHeight: 1 }}
      >
        {n}
      </div>
      <div
        className="l font-mono"
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Card({
  title,
  mb,
  children,
}: {
  title: string;
  mb?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="form-card"
      style={{
        background: "var(--bg-primary)",
        border: "1px solid #1d1d1d",
        padding: 18,
        marginBottom: mb,
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

function BtnLink({
  href,
  primary,
  target,
  children,
}: {
  href: string;
  primary?: boolean;
  target?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target={target}
      className="btn font-mono"
      style={{
        fontSize: 11,
        padding: "8px 14px",
        border: "1px solid",
        borderColor: primary ? "var(--accent)" : "#2a2a2a",
        background: primary ? "var(--accent)" : "transparent",
        color: primary ? "#050505" : "var(--text-secondary)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "all .15s",
      }}
    >
      {children}
    </Link>
  );
}

function Activity({
  title,
  what,
  when,
}: {
  title: string;
  what: string;
  when: string;
}) {
  return (
    <div>
      ◦{" "}
      <span style={{ color: "var(--accent-light)" }}>{title}</span> · {what} ·{" "}
      {when}
    </div>
  );
}
