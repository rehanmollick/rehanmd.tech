"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      <aside className="w-60 border-r border-white/10 p-6 sticky top-0 h-screen">
        <Link
          href="/admin"
          className="block text-accent text-xs tracking-[0.3em] uppercase mb-8"
          style={{ fontFamily: "var(--font-pixel), monospace" }}
        >
          / ADMIN
        </Link>
        <nav className="space-y-2 text-sm">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/dispatches/new">New Dispatch</NavLink>
          <NavLink href="/admin/projects">Projects</NavLink>
          <NavLink href="/admin/about">About config</NavLink>
        </nav>
        <div className="absolute bottom-6 left-6 right-6 text-xs text-text-muted">
          {session?.user?.name && <p className="mb-2">@{(session as { githubLogin?: string }).githubLogin}</p>}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-accent hover:text-accent-light"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-text-secondary hover:text-accent hover:bg-white/5 rounded"
    >
      {children}
    </Link>
  );
}
