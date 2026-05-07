/**
 * KV-backed sliding-window rate limiter for LLM endpoints.
 *
 * Per the spec (.spec/02-architecture.md §AI wiring): 30 LLM calls / 10 min
 * per user. Bucket key shape: `rate:llm:<userId>`. Each call appends a
 * timestamp and trims older-than-window entries.
 *
 * Falls open (allows the call) when KV is unconfigured or errors — better to
 * serve users than 503 on a transient KV blip.
 */
import { kv } from "@vercel/kv";

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LIMIT = 30;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // unix ms
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const key = `rate:llm:${userId}`;
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  try {
    // Read current bucket — array of timestamps (ms).
    const existing = (await kv.get<number[]>(key)) || [];
    const recent = existing.filter((t) => t > cutoff);

    if (recent.length >= LIMIT) {
      const oldest = recent[0] ?? now;
      return {
        allowed: false,
        remaining: 0,
        resetAt: oldest + WINDOW_MS,
      };
    }

    const next = [...recent, now];
    await kv.set(key, next, { ex: Math.ceil(WINDOW_MS / 1000) });
    return {
      allowed: true,
      remaining: Math.max(0, LIMIT - next.length),
      resetAt: now + WINDOW_MS,
    };
  } catch (e) {
    console.error("[rate-limit] KV error, falling open", e);
    return { allowed: true, remaining: LIMIT, resetAt: now + WINDOW_MS };
  }
}

/** Standard 429 response body for rate-limited requests. */
export function rateLimitResponse(result: RateLimitResult) {
  return {
    error:
      "Hit 30 calls / 10 min limit. Cool down and retry.",
    code: "RATE_LIMITED" as const,
    retryAfterMs: Math.max(0, result.resetAt - Date.now()),
  };
}
