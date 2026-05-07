"use client";

// Admin shell — sidebar + content area.
// Layout from prototype/index.html lines 1380–1399 + CSS lines 994–1015
// per .spec/13 §C.10. Settings entry is dropped per MASTER-SPEC out-of-scope.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  count?: number | string;
}

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", count: "—" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/projects/new", label: "＋ New Project" },
  { href: "/admin/dispatches", label: "Dispatches" },
  { href: "/admin/dispatches/new", label: "＋ New Dispatch" },
  { href: "/admin/media", label: "Media Library" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div
      className="admin"
      style={{
        minHeight: "100vh",
        background: "var(--page-outer)",
        padding: "90px 0 40px",
      }}
    >
      <div
        className="admin-chrome"
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 24,
        }}
      >
        <aside
          className="admin-side"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid #1d1d1d",
            padding: 18,
            height: "fit-content",
            position: "sticky",
            top: 90,
          }}
        >
          <div
            className="al-title font-pixel"
            style={{
              fontSize: 22,
              color: "var(--accent-light)",
              letterSpacing: "0.1em",
              marginBottom: 4,
            }}
          >
            ▸ CONTROL
          </div>
          <div
            className="al-sub font-mono"
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            STATIONMASTER
          </div>
          <nav
            className="admin-nav"
            style={{ display: "flex", flexDirection: "column", gap: 4 }}
          >
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-mono"
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: 12,
                    color: active ? "var(--accent-light)" : "var(--text-secondary)",
                    border: "1px solid",
                    borderColor: active ? "var(--accent-dim)" : "transparent",
                    background: active ? "rgba(191,87,0,.1)" : "transparent",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <span>{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className="count"
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        background: "#1d1d1d",
                        padding: "2px 6px",
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {session?.user && (
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid #1d1d1d",
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              <p style={{ marginBottom: 8 }}>
                signed in as{" "}
                <span style={{ color: "var(--accent-light)" }}>
                  @{(session as { githubLogin?: string }).githubLogin || "you"}
                </span>
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-mono"
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                }}
              >
                Sign out ↗
              </button>
            </div>
          )}
        </aside>

        <main className="admin-main" style={{ minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
