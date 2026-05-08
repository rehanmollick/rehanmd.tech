/**
 * About bulletin config — content for the About modal.
 *
 * In a future PR (D2-19) this will be loaded from public/about/about.md
 * frontmatter. For now it stays inline so the migration is a focused step.
 *
 * Source of literal copy: .spec/13-prototype-literal-extracts.md §A.4.
 * Pin coordinates use the hand-drawn SVG world map's viewBox (0 0 1000 500).
 */

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
  label?: string; // Override for the number badge (e.g. "08 ★")
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
  // Hero
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  tagline: string;

  // Sections
  bio: string;
  stack: string[];
  afk: string;

  // Side widgets
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

export const DEFAULT_ABOUT: AboutConfig = {
  eyebrow: "PASSENGER PROFILE",
  titleLine1: "Md Rehan",
  titleLine2: "Mollick",
  tagline:
    "CS @ UT Austin. I build a lot, ship most of it, and break the rest on purpose.",

  bio: "Computer Science student at UT Austin. I spend most of my time building things — full-stack web, AI tooling, the occasional smart contract. The rest of the time I'm probably at the gym, in a pool, or losing at chess to someone I shouldn't be losing to.",
  stack: [
    "Next.js",
    "TypeScript",
    "React",
    "Three.js",
    "Tailwind",
    "Postgres",
    "Solidity",
    "Python",
    "Vercel",
    "Framer Motion",
  ],
  afk: "Climbing, swimming, gym, chess. Anything that gets me away from a keyboard for a couple hours.",

  widgets: {
    currentProject: {
      label: "◉ CURRENTLY WORKING ON",
      big: "[ project name ]",
      small: "[ short description · timeframe ]",
    },
    nowPlaying: {
      label: "♫ NOW PLAYING",
      big: "[ song · artist ]",
      equalizerBars: 7,
    },
    obsessed: {
      label: "★ CURRENTLY OBSESSED WITH",
      big: "[ a movie / show / topic / random thing ]",
      small: "[ optional subtitle ]",
    },
    win: {
      label: "▣ RECENT WIN",
      big: "[ latest accomplishment ]",
      small: "[ where / when ]",
    },
  },

  atlas: {
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
      {
        step: 8,
        name: "AUSTIN",
        sub: "TX · 78712 · HOME",
        svgX: 229,
        svgY: 166,
        leftPct: 22.9,
        topPct: 33.2,
        anchor: "b",
        radius: 9,
        final: true,
        label: "08 ★",
      },
    ],
    rope: [
      { from: 1, to: 2, d: "M 751 184 Q 825 130 888 151" },
      {
        from: 2,
        to: 3,
        segments: [
          { d: "M 888 151 Q 940 80 990 90" },
          { d: "M 10 90 Q 100 60 295 137" },
        ],
      },
      { from: 3, to: 4, d: "M 295 137 Q 280 120 266 129" },
      { from: 4, to: 5, d: "M 266 129 Q 285 150 271 172" },
      { from: 5, to: 6, d: "M 271 172 Q 240 175 226 143" },
      { from: 6, to: 7, d: "M 226 143 Q 232 152 231 159" },
      { from: 7, to: 8, d: "M 231 159 L 229 166" },
    ],
    terminusPulse: {
      rValues: "20;30;20",
      opacityValues: ".55;0;.55",
      dur: "2.4s",
    },
  },

  photos: [
    { src: null, caption: "PHOTO · 01" },
    { src: null, caption: "PHOTO · 02" },
    { src: null, caption: "PHOTO · 03" },
    { src: null, caption: "PHOTO · 04" },
  ],

  factsLabel: "▸ FIELD NOTES",
  facts: [
    "Born in Dhaka, raised on 7 zip codes",
    "Owns 4 keyboards, uses 1",
    "Tabs > spaces",
    "Last hackathon: too recent to count",
  ],

  footer: {
    left: "POSTED · MARCH 2026 · DO NOT REMOVE",
    stamp: "VERIFIED\nSTATIONMASTER",
    right: "rehanmd.tech · STATION 07",
  },

  header: {
    bulletinChip: "BULLETIN №07",
    authority: "◉ ORANGE LINE TRANSIT AUTHORITY",
    closeLabel: "✕ CLOSE [ESC]",
  },

  hometown: { name: "Austin, TX", svgX: 229, svgY: 166 },

  links: [],
};

export async function getAboutConfig(): Promise<AboutConfig> {
  return DEFAULT_ABOUT;
}
