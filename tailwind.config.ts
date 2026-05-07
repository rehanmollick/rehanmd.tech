import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page outer (body bg) — darker than --bg-primary
        "page-outer": "var(--page-outer)",

        // Core palette — verbatim from prototype/index.html :root
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          dim: "var(--accent-dim)",
          deep: "var(--accent-deep)",
          glow: "var(--accent-glow)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        brick: {
          a: "var(--brick-a)",
          b: "var(--brick-b)",
          mortar: "var(--brick-mortar)",
        },
        amber: "var(--amber)",
        lamp: "var(--lamp)",

        // Bulletin (cream paper)
        paper: {
          DEFAULT: "var(--paper)",
          2: "var(--paper-2)",
          3: "var(--paper-3)",
          dark: "var(--paper-dark)",
          text: "var(--paper-text)",
          eyebrow: "var(--paper-eyebrow)",
          rule: "var(--paper-rule)",
        },
        bulletin: {
          stamp: "var(--bulletin-stamp-red)",
          amber: "var(--bulletin-amber)",
        },

        // Newspaper
        news: {
          paper: "var(--news-paper)",
          bg: "var(--news-paper-bg)",
          rule: "var(--news-rule)",
          text: "var(--news-text)",
        },

        // Tape / cork accents
        tape: {
          amber: "var(--tape-amber)",
        },
        cork: {
          warm: "var(--cork-warm-1)",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "monospace",
        ],
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        "body-serif": [
          "var(--font-body-serif)",
          "Source Serif 4",
          "Georgia",
          "serif",
        ],
        type: ["var(--font-type)", "Special Elite", "Courier New", "monospace"],
        "news-body": ["Georgia", "Times New Roman", "serif"],
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        bob: "bob 1.4s ease-in-out infinite",
        qbob: "qbob 2.6s ease-in-out infinite",
        flicker: "flicker 1.5s infinite",
        flick: "flick 4s ease-in-out infinite",
        eq: "eq 1s ease-in-out infinite",
        pulse: "pulse 2s infinite",
        spin: "spin 6s linear infinite",
        blink: "blink 2s infinite",
        blinkcur: "blinkcur 1s steps(2) infinite",
        pull: "pull 1.6s ease-in-out infinite",
        steam: "steam 8s ease-in-out infinite",
        amfade: "amfade .3s ease-out forwards",
        amslide: "amslide .45s cubic-bezier(.2,.8,.3,1.1)",
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.25em",
        widest4: "0.3em",
        widest5: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
