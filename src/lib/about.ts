// About bulletin config. Editable text + photos live in:
//
//   public/about/about.md          (frontmatter — bio, widgets, facts, links)
//   public/about/<image files>     (referenced from `photos:` by filename)
//
// The world map (8 pins + rope + hometown) is geometric SVG data tied to the
// hand-drawn map's viewBox — it stays inline below since it's not expected to
// change with content edits.
//
// To update the bulletin: edit public/about/about.md. To add real photos:
// drop image files into public/about/ and set `photos[*].src` to the
// filename in the frontmatter.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ABOUT_FILE = path.join(process.cwd(), "public/about/about.md");

export type PinAnchor = "t" | "b" | "l" | "r";

export interface AtlasPin {
  step: number;
  name: string;
  sub: string;
  svgX: number;
  svgY: number;
  leftPct: number;
  topPct: number;
  anchor: PinAnchor;
  radius: number;
  final?: boolean;
  label?: string;
}

export interface RopeSegment {
  d: string;
}

export interface RopeHop {
  from: number;
  to: number;
  d?: string;
  segments?: RopeSegment[];
}

export interface AboutWidget {
  label: string;
  big: string;
  small?: string;
  equalizerBars?: number;
}

export interface AboutPhoto {
  src: string | null;
  caption: string;
}

export interface AboutLink {
  label: string;
  href: string;
}

export interface AboutAtlas {
  eyebrow: string;
  title: string;
  headerBullet: string;
  headerTitle: string;
  headerRight: string;
  stampTL: string[];
  stampBR: string[];
  legend: { kind: "rope" | "pin" | "terminus"; label: string }[];
  pins: AtlasPin[];
  rope: RopeHop[];
  terminusPulse: { rValues: string; opacityValues: string; dur: string };
}

export interface AboutHeader {
  bulletinChip: string;
  authority: string;
  closeLabel: string;
}

export interface AboutFooter {
  left: string;
  stamp: string;
  right: string;
}

export interface AboutConfig {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  tagline: string;
  bio: string;
  stack: string[];
  afk: string;
  widgets: {
    currentProject: AboutWidget;
    nowPlaying: AboutWidget;
    obsessed: AboutWidget;
    win: AboutWidget;
  };
  atlas: AboutAtlas;
  photos: AboutPhoto[];
  factsLabel: string;
  facts: string[];
  footer: AboutFooter;
  header: AboutHeader;
  hometown: { name: string; svgX: number; svgY: number };
  links: AboutLink[];
}

// Atlas geometry — hand-drawn world map coordinates from the prototype.
// Not editable via about.md (would require coordinate-system understanding).
const ATLAS: AboutAtlas = {
  eyebrow: "ORIGIN · 8 STOPS · TERMINUS: AUSTIN",
  title: "From there to here.",
  headerBullet: "RM",
  headerTitle: "REHAN ATLAS",
  headerRight: "EFFECTIVE 2000 — PRESENT · ONE-WAY · 8,500 MI",
  stampTL: ["REHAN ATLAS · ED. 2026", "≈ 8,500 MI · 4 COUNTRIES"],
  stampBR: ["26 YEARS · 1 PASSENGER", "EQUIRECTANGULAR PROJECTION"],
  legend: [
    { kind: "rope", label: "RED ROPE = ROUTE" },
    { kind: "pin", label: "STOP" },
    { kind: "terminus", label: "TERMINUS ★ AUSTIN" },
  ],
  pins: [
    { step: 1, name: "DHAKA", sub: "BANGLADESH", svgX: 751, svgY: 184, leftPct: 75.1, topPct: 36.8, anchor: "b", radius: 7 },
    { step: 2, name: "TOKYO", sub: "JAPAN · LAYOVER", svgX: 888, svgY: 151, leftPct: 88.8, topPct: 30.2, anchor: "b", radius: 7 },
    { step: 3, name: "QUEENS, NYC", sub: "NEW YORK · LANDING", svgX: 295, svgY: 137, leftPct: 29.5, topPct: 27.4, anchor: "t", radius: 7 },
    { step: 4, name: "MIDLAND", sub: "MICHIGAN", svgX: 266, svgY: 129, leftPct: 26.6, topPct: 25.8, anchor: "l", radius: 6 },
    { step: 5, name: "TAMPA", sub: "FLORIDA", svgX: 271, svgY: 172, leftPct: 27.1, topPct: 34.4, anchor: "r", radius: 6 },
    { step: 6, name: "GREAT BEND", sub: "KANSAS", svgX: 226, svgY: 143, leftPct: 22.6, topPct: 28.6, anchor: "l", radius: 6 },
    { step: 7, name: "DALLAS", sub: "TEXAS · DETOUR", svgX: 231, svgY: 159, leftPct: 23.1, topPct: 31.8, anchor: "l", radius: 6 },
    { step: 8, name: "AUSTIN", sub: "TX · 78712 · HOME", svgX: 229, svgY: 166, leftPct: 22.9, topPct: 33.2, anchor: "b", radius: 9, final: true, label: "08 ★" },
  ],
  rope: [
    { from: 1, to: 2, d: "M 751 184 Q 825 130 888 151" },
    { from: 2, to: 3, segments: [{ d: "M 888 151 Q 940 80 990 90" }, { d: "M 10 90 Q 100 60 295 137" }] },
    { from: 3, to: 4, d: "M 295 137 Q 280 120 266 129" },
    { from: 4, to: 5, d: "M 266 129 Q 285 150 271 172" },
    { from: 5, to: 6, d: "M 271 172 Q 240 175 226 143" },
    { from: 6, to: 7, d: "M 226 143 Q 232 152 231 159" },
    { from: 7, to: 8, d: "M 231 159 L 229 166" },
  ],
  terminusPulse: { rValues: "20;30;20", opacityValues: ".55;0;.55", dur: "2.4s" },
};

interface PhotoFrontmatter {
  src?: string | null;
  caption?: string;
}

function readFrontmatter(): Record<string, unknown> {
  if (!fs.existsSync(ABOUT_FILE)) return {};
  const raw = fs.readFileSync(ABOUT_FILE, "utf8");
  return matter(raw).data;
}

function buildConfig(): AboutConfig {
  const fm = readFrontmatter() as Record<string, unknown>;
  const photosIn = (fm.photos as PhotoFrontmatter[]) || [];

  return {
    eyebrow: String(fm.eyebrow || "PASSENGER PROFILE"),
    titleLine1: String(fm.titleLine1 || "Md Rehan"),
    titleLine2: String(fm.titleLine2 || "Mollick"),
    tagline: String(fm.tagline || ""),
    bio: String(fm.bio || ""),
    stack: (fm.stack as string[]) || [],
    afk: String(fm.afk || ""),
    widgets: (fm.widgets as AboutConfig["widgets"]) || {
      currentProject: { label: "◉ CURRENTLY WORKING ON", big: "" },
      nowPlaying: { label: "♫ NOW PLAYING", big: "", equalizerBars: 7 },
      obsessed: { label: "★ CURRENTLY OBSESSED WITH", big: "" },
      win: { label: "▣ RECENT WIN", big: "" },
    },
    atlas: ATLAS,
    photos: photosIn.map((p) => ({
      src: p.src ? (p.src.startsWith("/") ? p.src : `/about/${p.src}`) : null,
      caption: String(p.caption || ""),
    })),
    factsLabel: String(fm.factsLabel || "▸ FIELD NOTES"),
    facts: (fm.facts as string[]) || [],
    footer: (fm.footer as AboutFooter) || {
      left: "",
      stamp: "",
      right: "",
    },
    header: (fm.header as AboutHeader) || {
      bulletinChip: "BULLETIN №07",
      authority: "◉ ORANGE LINE TRANSIT AUTHORITY",
      closeLabel: "✕ CLOSE [ESC]",
    },
    hometown: { name: "Austin, TX", svgX: 229, svgY: 166 },
    links: (fm.links as AboutLink[]) || [],
  };
}

// Eagerly built at module init — same fs file read pattern as projects.ts.
export const DEFAULT_ABOUT: AboutConfig = buildConfig();

export async function getAboutConfig(): Promise<AboutConfig> {
  return DEFAULT_ABOUT;
}
