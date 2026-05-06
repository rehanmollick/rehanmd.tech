"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { AboutConfig, OriginPin } from "@/lib/about";

interface Props {
  onClose: () => void;
}

/**
 * Wheatpaste-poster fullscreen "WHO IS THIS GUY" bulletin.
 * Loads dynamic config (now-playing, photos, pins, bio) from /api/about.
 */
export default function AboutBulletinModal({ onClose }: Props) {
  const [cfg, setCfg] = useState<AboutConfig | null>(null);

  // Load dynamic config
  useEffect(() => {
    let cancel = false;
    fetch("/api/about")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancel && data) setCfg(data as AboutConfig);
      })
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        className="relative my-12 mx-4 w-full max-w-6xl"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "repeating-linear-gradient(0deg, #f4ecd6 0 2px, #efe6cc 2px 4px)",
          color: "#1a1a1a",
          boxShadow: "0 30px 100px rgba(0,0,0,0.6)",
          padding: "32px 36px",
          fontFamily: "var(--font-space-mono), monospace",
          border: "1px solid rgba(120,80,30,0.3)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 z-10 text-[#1a1a1a] hover:text-[#bf5700] text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Masthead */}
        <header className="border-b-4 border-[#1a1a1a] pb-3 mb-6">
          <div
            className="text-[10px] tracking-[0.3em] uppercase text-[#bf5700]"
            style={{ fontFamily: "var(--font-pixel), monospace" }}
          >
            THE REHAN BULLETIN — VOL.&nbsp;I — AUSTIN, TX
          </div>
          <h1
            className="text-5xl md:text-7xl font-black tracking-tight mt-1 leading-[0.9]"
            style={{ fontFamily: "var(--font-space-mono), monospace" }}
          >
            WHO IS THIS GUY?
          </h1>
          <p className="text-sm italic text-[#3a2c14] mt-2">
            Md Rehan Mollick · Software Engineer · CS @ UT Austin
          </p>
        </header>

        {/* Top row: bio + now-playing + ask claude */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <article className="md:col-span-2 border border-[#1a1a1a]/30 p-5 bg-[#fffaf0]">
            <h2 className="text-xs tracking-widest uppercase text-[#bf5700] mb-2">
              The Story So Far
            </h2>
            <p className="text-sm leading-relaxed text-[#1a1a1a]">
              I&apos;m a CS student at UT Austin who builds things because I can&apos;t
              sit still. Hackathons, startups, side projects at 2am — if there&apos;s
              a problem and a keyboard nearby, I&apos;m probably already working on
              it.
            </p>
            <p className="text-sm leading-relaxed mt-3 text-[#1a1a1a]">
              I think the best way to learn is to ship. Right now I&apos;m deep into
              full-stack web dev, blockchain, and AI tooling. When I&apos;m not
              coding I&apos;m climbing, swimming, or optimizing something that
              doesn&apos;t need optimizing.
            </p>
          </article>

          <aside className="space-y-4">
            <NowPlayingCard track={cfg?.nowPlaying ?? "—"} />
            <AskClaudeCard />
          </aside>
        </div>

        {/* Photo strip */}
        <PhotoStrip photos={cfg?.photos ?? ["", "", "", ""]} />

        {/* World map of origin */}
        <section className="mt-8 border border-[#1a1a1a]/30 p-5 bg-[#fffaf0]">
          <h2 className="text-xs tracking-widest uppercase text-[#bf5700] mb-3">
            Origin → Terminus
          </h2>
          <WorldOriginMap pins={cfg?.pins ?? []} />
        </section>

        {/* Tech + hobbies */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <TwoColList
            title="Stack & Tools"
            items={cfg?.techStack ?? []}
            tone="orange"
          />
          <TwoColList
            title="When I'm AFK"
            items={cfg?.hobbies ?? []}
            tone="dark"
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-3 border-t-2 border-[#1a1a1a] text-[10px] tracking-widest uppercase text-[#3a2c14] flex justify-between">
          <span>End of Bulletin</span>
          <span>Press Esc or click outside to close</span>
        </footer>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- subcomponents ---------------- */

function NowPlayingCard({ track }: { track: string }) {
  return (
    <div
      className="border border-[#1a1a1a]/30 p-3 bg-[#1a1a1a] text-[#f5f5f5]"
      style={{ fontFamily: "var(--font-pixel), monospace" }}
    >
      <div className="text-[8px] tracking-widest text-[#bf5700] mb-1">
        NOW PLAYING
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-[2px] items-end h-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[2px] bg-[#bf5700] animate-pulse"
              style={{
                height: `${30 + ((i * 23) % 70)}%`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        <span className="text-[10px] truncate">{track}</span>
      </div>
    </div>
  );
}

function AskClaudeCard() {
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = useCallback(async () => {
    if (!q.trim() || loading) return;
    setLoading(true);
    setA("");
    try {
      const r = await fetch("/api/ask-claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = (await r.json()) as { answer?: string };
      setA(data.answer || "(no answer)");
    } catch {
      setA("Error reaching the model. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [q, loading]);

  return (
    <div className="border border-[#bf5700] p-3 bg-[#fffaf0]">
      <div className="text-[10px] tracking-widest uppercase text-[#bf5700] mb-2">
        Ask About Rehan
      </div>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        rows={2}
        placeholder="What's he working on?"
        className="w-full text-xs p-2 bg-white border border-[#1a1a1a]/40 resize-none focus:outline-none focus:border-[#bf5700]"
      />
      <button
        onClick={ask}
        disabled={loading || !q.trim()}
        className="mt-2 px-3 py-1 bg-[#bf5700] text-white text-[10px] tracking-widest uppercase disabled:opacity-50"
      >
        {loading ? "Thinking…" : "Ask"}
      </button>
      {a && (
        <div className="mt-2 text-xs leading-snug text-[#1a1a1a] border-t border-[#1a1a1a]/20 pt-2">
          {a}
        </div>
      )}
    </div>
  );
}

function PhotoStrip({ photos }: { photos: string[] }) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {photos.slice(0, 4).map((src, i) => (
        <div
          key={i}
          className="relative aspect-[4/5] border border-[#1a1a1a]/40 bg-[#1a1a1a]"
          style={{
            transform: `rotate(${[-1.5, 1, -0.5, 1.2][i] || 0}deg)`,
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Photo ${i + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#bf5700]/60 text-[10px] tracking-widest uppercase">
              Photo {i + 1}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function TwoColList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "orange" | "dark";
}) {
  return (
    <div className="border border-[#1a1a1a]/30 p-5 bg-[#fffaf0]">
      <h2 className="text-xs tracking-widest uppercase text-[#bf5700] mb-3">
        {title}
      </h2>
      <ul className="grid grid-cols-2 gap-1.5 text-sm">
        {items.map((it) => (
          <li key={it} className="flex items-center gap-2">
            <span
              className="inline-block w-1.5 h-1.5"
              style={{ background: tone === "orange" ? "#bf5700" : "#1a1a1a" }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Equirectangular projection of pins onto an SVG world map. */
function WorldOriginMap({ pins }: { pins: OriginPin[] }) {
  const W = 900;
  const H = 460;

  function project(lon: number, lat: number) {
    return [((lon + 180) / 360) * W, ((90 - lat) / 180) * H] as const;
  }

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full">
        <rect width={W} height={H} fill="#1a1a1a" />
        {/* Stylized continent outlines (rough Natural-Earth-ish blobs) */}
        <g fill="#2a2a2a" stroke="#3a3a3a" strokeWidth="0.5">
          {/* North America */}
          <path d="M 80 90 L 230 75 L 280 130 L 270 200 L 215 240 L 175 235 L 145 195 L 110 160 Z" />
          {/* South America */}
          <path d="M 220 250 L 270 245 L 285 310 L 270 380 L 240 410 L 215 360 L 210 290 Z" />
          {/* Europe */}
          <path d="M 410 95 L 490 90 L 510 140 L 470 165 L 425 150 L 405 125 Z" />
          {/* Africa */}
          <path d="M 440 170 L 510 160 L 535 230 L 525 320 L 490 360 L 460 330 L 445 250 Z" />
          {/* Asia */}
          <path d="M 510 80 L 720 70 L 770 130 L 740 200 L 690 230 L 620 215 L 555 175 L 525 130 Z" />
          {/* India */}
          <path d="M 615 175 L 660 175 L 670 220 L 645 245 L 625 215 Z" />
          {/* Australia */}
          <path d="M 720 290 L 800 280 L 815 330 L 770 350 L 730 335 Z" />
        </g>

        {/* Connection rope */}
        {pins.length > 1 && (
          <path
            d={pins
              .map((p, i) => {
                const [x, y] = project(p.lon, p.lat);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#bf5700"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.85"
          />
        )}

        {/* Pins */}
        {pins.map((p, i) => {
          const [x, y] = project(p.lon, p.lat);
          return (
            <g key={`${p.city}-${i}`}>
              {p.terminus && (
                <circle
                  cx={x}
                  cy={y}
                  r="9"
                  fill="none"
                  stroke="#ff6b1a"
                  strokeWidth="1.5"
                  opacity="0.8"
                >
                  <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={x} cy={y} r={p.terminus ? "5" : "3.5"} fill={p.terminus ? "#ff6b1a" : "#bf5700"} />
              <text
                x={x + 7}
                y={y + 3}
                fill={p.terminus ? "#ff6b1a" : "#f4ecd6"}
                fontSize="10"
                fontFamily="var(--font-space-mono), monospace"
                fontWeight={p.terminus ? 700 : 400}
              >
                {p.terminus ? `★ ${p.city.toUpperCase()}` : p.city}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
