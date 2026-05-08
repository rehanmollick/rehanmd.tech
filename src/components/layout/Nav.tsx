"use client";

import { useState } from "react";
import Link from "next/link";

// Hrefs are absolute (`/#anchor`) so anchor jumps work from any route —
// e.g. clicking ABOUT from /blog navigates back to / and scrolls to #about.
// BLOG points at the homepage's #dispatches section rather than the /blog
// route — the route still exists for direct links and the dispatch reader's
// back-link, but the nav scrolls to where the wall already lives on /.
const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
  { href: "/#dispatches", label: "Blog" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-6"
      style={{
        paddingTop: 0,
        paddingBottom: 4,
        lineHeight: 1,
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo / Name */}
        <Link
          href="/"
          className="text-sm font-bold tracking-wider text-text-primary hover:text-accent-light transition-colors"
          style={{
            fontFamily: "var(--font-pixel), monospace",
            lineHeight: 1,
            display: "inline-block",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
          rehan<span className="text-accent">md</span>.tech
        </Link>

        {/* Desktop links */}
        <ul
          className="hidden md:flex items-center gap-8"
          style={{ lineHeight: 1, marginTop: 0 }}
        >
          {navLinks.map((link) => (
            <li key={link.href} style={{ lineHeight: 1 }}>
              <Link
                href={link.href}
                className="text-xs tracking-widest uppercase text-text-secondary hover:text-accent-light transition-colors"
                style={{
                  fontFamily: "var(--font-pixel), monospace",
                  lineHeight: 1,
                  display: "inline-block",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 glass-card p-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm tracking-widest uppercase text-text-secondary hover:text-accent-light transition-colors"
                  style={{ fontFamily: "var(--font-pixel), monospace" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
