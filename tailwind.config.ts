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
        bg: {
          primary: "#0a0a0a",
          secondary: "#111111",
          tertiary: "#1a1a1a",
        },
        accent: {
          DEFAULT: "#BF5700",
          light: "#E87A2E",
          dim: "#8B3F00",
          glow: "#FF6B1A",
        },
        text: {
          primary: "#f5f5f5",
          secondary: "#a1a1a1",
          muted: "#666666",
        },
        tunnel: {
          light: "#FFB366",
          fog: "#0d0d0d",
        },
      },
      fontFamily: {
        mono: ["var(--font-space-mono)", "monospace"],
        sans: ["var(--font-inter)", "sans-serif"],
        code: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "flicker": "flicker 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "52%": { opacity: "0.95" },
          "54%": { opacity: "0.8" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(191, 87, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(191, 87, 0, 0.6)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
