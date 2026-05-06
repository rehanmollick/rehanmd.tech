import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_LOGIN = process.env.ADMIN_GITHUB_LOGIN || "rehanmollick";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin and /api/admin (not /api/auth or public routes)
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Not signed in → redirect to /api/auth/signin?callbackUrl=...
  if (!token) {
    if (pathname.startsWith("/api/admin")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const signInUrl = new URL("/api/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Signed in but not the allow-listed GitHub user → bounce to home
  if ((token as { githubLogin?: string }).githubLogin !== ADMIN_LOGIN) {
    if (pathname.startsWith("/api/admin")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
