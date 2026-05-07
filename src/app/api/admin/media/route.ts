import { NextResponse } from "next/server";
import { put, list, del } from "@vercel/blob";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = /^(image\/.+|video\/(mp4|webm|quicktime))$/;

export async function GET() {
  try {
    const { blobs } = await list();
    return NextResponse.json({
      items: blobs.map((b) => ({
        pathname: b.pathname,
        url: b.url,
        size: b.size,
        uploadedAt: b.uploadedAt,
        contentType: (b as { contentType?: string }).contentType,
      })),
    });
  } catch (e) {
    console.error("[admin/media GET]", e);
    return NextResponse.json(
      { error: "Blob list failed", code: "INTERNAL" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { error: "Missing file", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  const name = (formData.get("filename") as string) || (file as File).name || "upload";

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      {
        error: `File exceeds ${MAX_BYTES / 1024 / 1024}MB`,
        code: "INVALID_INPUT",
      },
      { status: 400 },
    );
  }
  if (!ACCEPTED.test(file.type)) {
    return NextResponse.json(
      { error: `Unsupported type: ${file.type}`, code: "INVALID_INPUT" },
      { status: 400 },
    );
  }

  try {
    const blob = await put(name, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({
      pathname: blob.pathname,
      url: blob.url,
    });
  } catch (e) {
    console.error("[admin/media POST]", e);
    return NextResponse.json(
      { error: "Blob upload failed", code: "INTERNAL" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "Missing url query param", code: "INVALID_INPUT" },
      { status: 400 },
    );
  }
  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/media DELETE]", e);
    return NextResponse.json(
      { error: "Blob delete failed", code: "INTERNAL" },
      { status: 500 },
    );
  }
}
