"use client";

// Sidebar of 4 widgets: CURRENTLY WORKING ON, NOW PLAYING, OBSESSED, RECENT WIN.
// Verbatim layout + copy from prototype/index.html lines 1444–1471 per .spec/13 §C.3.

import type { AboutConfig } from "@/lib/about";

type Widgets = AboutConfig["widgets"];

export default function BulletinSidebar({ widgets }: { widgets: Widgets }) {
  return (
    <aside
      className="ap-side"
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      <Widget
        label={widgets.currentProject.label}
        big={widgets.currentProject.big}
        small={widgets.currentProject.small}
      />
      <Widget label={widgets.nowPlaying.label} big={widgets.nowPlaying.big}>
        <Equalizer bars={widgets.nowPlaying.equalizerBars ?? 7} />
      </Widget>
      <Widget
        label={widgets.obsessed.label}
        big={widgets.obsessed.big}
        small={widgets.obsessed.small}
      />
      <Widget
        label={widgets.win.label}
        big={widgets.win.big}
        small={widgets.win.small}
      />
    </aside>
  );
}

function Widget({
  label,
  big,
  small,
  children,
}: {
  label: string;
  big: string;
  small?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="ap-widget"
      style={{
        background: "rgba(255,250,235,.5)",
        border: "1px solid rgba(80,50,20,.25)",
        padding: "18px 20px",
        position: "relative",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background:
            "repeating-linear-gradient(45deg, #bf5700 0 6px, #1a0f05 6px 12px)",
          opacity: 0.65,
        }}
      />
      <h4
        className="font-mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "#7a3a05",
          margin: "8px 0 10px",
          textTransform: "uppercase",
        }}
      >
        {label}
      </h4>
      <div
        className="font-pixel"
        style={{
          fontSize: 18,
          color: "#1a0f05",
          lineHeight: 1.3,
          letterSpacing: "0.02em",
        }}
      >
        {big}
      </div>
      {small && (
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "#5a3a18",
            marginTop: 4,
            letterSpacing: "0.05em",
          }}
        >
          {small}
        </div>
      )}
      {children}
    </div>
  );
}

function Equalizer({ bars }: { bars: number }) {
  // Stagger from .spec §D.6 — 7 bars at 0/.15/.3/.45/.6/.75/.9s
  const delays = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        height: 20,
        marginTop: 10,
      }}
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          style={{
            flex: 1,
            background: "#bf5700",
            animation: "eq 1s ease-in-out infinite",
            animationDelay: `${delays[i % delays.length]}s`,
          }}
        />
      ))}
    </div>
  );
}
