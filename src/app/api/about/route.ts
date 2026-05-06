import { NextResponse } from "next/server";
import { getAboutConfig } from "@/lib/about";

export async function GET() {
  const cfg = await getAboutConfig();
  return NextResponse.json(cfg);
}

// Admin-only via /api/admin/about (which runs through middleware allow-list).
// This public route is read-only.
export async function POST() {
  return NextResponse.json({ error: "Read-only. Use /api/admin/about" }, { status: 405 });
}
