"use client";

// Cream pin-up dispatch card. Visual + content template extracted from
// prototype/index.html lines 244–296 + prototype/app.js lines 65–73.
// Variant colors cycle [default, variant-b, variant-c, variant-d] per index.

import Link from "next/link";
import type { CSSProperties } from "react";
import type { BlogPostMeta } from "@/lib/mdx";

const VARIANTS = [
  // default
  {
    bg: "linear-gradient(135deg, #f2ebd7 0%, #e8dfc5 40%, #ded2b2 100%)",
    color: "#2a2418",
    tape: "linear-gradient(to bottom, rgba(255,230,160,.75), rgba(220,195,120,.75))",
    tornEdge: "#e8dfc5",
  },
  // variant-b
  {
    bg: "linear-gradient(135deg,#ece3c8,#dcd1a8)",
    color: "#2a2418",
    tape: "linear-gradient(to bottom, rgba(255,230,160,.75), rgba(220,195,120,.75))",
    tornEdge: "#ece3c8",
  },
  // variant-c
  {
    bg: "linear-gradient(135deg,#f7f2dd,#e3d6a8)",
    color: "#2a2418",
    tape: "linear-gradient(to bottom, rgba(255,230,160,.75), rgba(220,195,120,.75))",
    tornEdge: "#f7f2dd",
  },
  // variant-d (warmer)
  {
    bg: "linear-gradient(135deg,#d8c89b,#c2ae7a)",
    color: "#1a1208",
    tape: "linear-gradient(to bottom, rgba(200,100,40,.7), rgba(170,70,20,.7))",
    tornEdge: "#d8c89b",
  },
];

interface Props {
  post: BlogPostMeta;
  index: number;
  layout: { x: number; y: number; w: number; h: number; tilt: number; z: number };
}

export default function DispatchCard({ post, index, layout }: Props) {
  const variant = VARIANTS[index % VARIANTS.length];
  const cardStyle: CSSProperties = {
    position: "absolute",
    left: `${layout.x}%`,
    top: `${layout.y}%`,
    width: layout.w,
    height: layout.h,
    transform: `rotate(${layout.tilt}deg)`,
    zIndex: layout.z,
    background: variant.bg,
    color: variant.color,
    boxShadow:
      "0 10px 18px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.4), inset 0 0 40px rgba(180,150,100,.2)",
    padding: "22px 20px 18px",
    fontFamily: "var(--font-type), 'Special Elite', 'Courier New', monospace",
    transition: "transform .25s ease, box-shadow .25s ease",
    cursor: "pointer",
    borderRadius: 1,
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="dispatch group"
      style={cardStyle}
      // Hover lift via inline handler since we can't easily inline transform overrides
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `translate(-2px,-6px) rotate(${layout.tilt}deg)`;
        e.currentTarget.style.zIndex = "20";
        e.currentTarget.style.boxShadow =
          "0 20px 36px rgba(0,0,0,.7), 0 4px 10px rgba(0,0,0,.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${layout.tilt}deg)`;
        e.currentTarget.style.zIndex = String(layout.z);
        e.currentTarget.style.boxShadow =
          "0 10px 18px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.4), inset 0 0 40px rgba(180,150,100,.2)";
      }}
    >
      {/* Torn top edge */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -2,
          right: -2,
          top: -6,
          height: 8,
          background: `
            linear-gradient(45deg, transparent 33%, ${variant.tornEdge} 33% 66%, transparent 66%) 0 0/10px 8px,
            linear-gradient(-45deg, transparent 33%, ${variant.tornEdge} 33% 66%, transparent 66%) 0 0/10px 8px
          `,
          filter: "drop-shadow(0 -1px 1px rgba(0,0,0,.3))",
        }}
      />
      {/* Masking tape */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: -16,
          transform: "translateX(-50%) rotate(-3deg)",
          width: 70,
          height: 22,
          background: variant.tape,
          boxShadow: "0 2px 4px rgba(0,0,0,.3)",
          opacity: 0.85,
        }}
      />

      <h3
        style={{
          fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif",
          fontWeight: 700,
          fontSize: 19,
          margin: "0 0 6px",
          color: "#1a1208",
          letterSpacing: "0.01em",
          lineHeight: 1.15,
        }}
      >
        {post.title}
      </h3>
      <div
        className="d-meta font-mono"
        style={{
          fontSize: 10,
          color: "#6a5a38",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        {formatDate(post.date)} · {post.readTime} MIN
      </div>
      <div
        className="d-excerpt"
        style={{
          fontSize: 13,
          lineHeight: 1.5,
          color: "#3a3020",
          fontFamily: "var(--font-serif), 'Playfair Display', Georgia, serif",
          fontStyle: "italic",
        }}
      >
        {post.excerpt}
      </div>
      <span
        className="d-stamp font-mono"
        style={{
          position: "absolute",
          bottom: 10,
          right: 12,
          fontSize: 9,
          color: "#6a4020",
          border: "1px solid #6a4020",
          padding: "2px 6px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          transform: "rotate(-6deg)",
          opacity: 0.6,
        }}
      >
        Posted
      </span>
    </Link>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    .toUpperCase();
}
