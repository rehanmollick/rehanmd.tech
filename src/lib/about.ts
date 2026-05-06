/**
 * About-page dynamic state (Now Playing, photos, bio for ask-Claude, origin pins).
 * Stored in Vercel KV under the key `about:config`.
 */
import { kv } from "@vercel/kv";

export interface OriginPin {
  city: string;
  country?: string;
  // Lat/lon in degrees; we project to a Natural-Earth-style equirectangular map client-side.
  lat: number;
  lon: number;
  note?: string;
  terminus?: boolean;
}

export interface AboutConfig {
  nowPlaying: string;
  photos: string[]; // 4 slot URLs (Vercel Blob URLs); empty string = empty slot
  bioPrompt: string; // Used by /api/ask-claude — the system prompt describing Rehan
  pins: OriginPin[];
  techStack: string[];
  hobbies: string[];
}

const KV_KEY = "about:config";

const DEFAULT_ABOUT: AboutConfig = {
  nowPlaying: "—",
  photos: ["", "", "", ""],
  bioPrompt:
    "You are answering on behalf of Md Rehan Mollick (Rehan), a CS student at UT Austin. He builds at hackathons, ships side projects, and works in full-stack web, blockchain, and AI tooling. He's from Bangladesh originally, lived in Tokyo, NYC, Michigan, Tampa, Kansas, and Dallas before settling in Austin. He climbs, swims, and likes optimizing things that don't need optimizing. Be friendly, concise, and a little dry.",
  pins: [
    { city: "Dhaka", country: "Bangladesh", lat: 23.81, lon: 90.41 },
    { city: "Tokyo", country: "Japan", lat: 35.68, lon: 139.69 },
    { city: "Queens", country: "USA", lat: 40.74, lon: -73.79 },
    { city: "Midland", country: "MI, USA", lat: 43.62, lon: -84.25 },
    { city: "Tampa", country: "FL, USA", lat: 27.95, lon: -82.46 },
    { city: "Great Bend", country: "KS, USA", lat: 38.36, lon: -98.76 },
    { city: "Dallas", country: "TX, USA", lat: 32.78, lon: -96.8 },
    { city: "Austin", country: "TX, USA", lat: 30.27, lon: -97.74, terminus: true },
  ],
  techStack: ["Next.js", "TypeScript", "React Three Fiber", "Solidity", "Python", "Tailwind", "Framer Motion"],
  hobbies: ["Climbing", "Swimming", "Hackathons", "Optimizing things that don't need optimizing"],
};

export async function getAboutConfig(): Promise<AboutConfig> {
  try {
    const stored = await kv.get<AboutConfig>(KV_KEY);
    if (!stored) return DEFAULT_ABOUT;
    // Merge with defaults to backfill new fields.
    return { ...DEFAULT_ABOUT, ...stored };
  } catch {
    // KV not configured yet — fall back to defaults so build doesn't fail.
    return DEFAULT_ABOUT;
  }
}

export async function setAboutConfig(next: Partial<AboutConfig>): Promise<AboutConfig> {
  const current = await getAboutConfig();
  const merged = { ...current, ...next };
  await kv.set(KV_KEY, merged);
  return merged;
}

export { DEFAULT_ABOUT };
