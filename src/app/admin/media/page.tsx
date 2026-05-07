// /admin/media — Vercel Blob library. Lists existing blobs, supports upload
// and per-tile delete. Per .spec/13 §C.10 + §10-admin.md.

import MediaLibrary from "@/components/admin/MediaLibrary";

export default function MediaLibraryPage() {
  return <MediaLibrary />;
}
