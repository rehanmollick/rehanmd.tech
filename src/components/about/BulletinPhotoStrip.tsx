"use client";

// Photo strip — 4 polaroid tiles. Striped placeholders when src is null.
// Per .spec/13 §C.3 + prototype CSS lines 834–838 (rotations per nth-child).

import type { AboutPhoto } from "@/lib/about";

const ROTATIONS = [
  "rotate(-1deg)",
  "rotate(1.5deg) translateY(6px)",
  "rotate(-.5deg) translateY(-4px)",
  "rotate(2deg) translateY(8px)",
];

export default function BulletinPhotoStrip({
  photos,
}: {
  photos: AboutPhoto[];
}) {
  return (
    <section
      className="ap-photos"
      style={{
        gridColumn: "1 / -1",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 14,
        paddingTop: 30,
        borderTop: "2px solid rgba(80,50,20,.25)",
      }}
    >
      {photos.map((p, i) => (
        <div
          key={i}
          className="ap-photo font-mono"
          style={{
            aspectRatio: "4 / 5",
            background: p.src
              ? `url(${p.src}) center / cover no-repeat, repeating-linear-gradient(45deg,#d4be8a 0 10px,#c8b07a 10px 20px)`
              : "repeating-linear-gradient(45deg,#d4be8a 0 10px,#c8b07a 10px 20px)",
            border: "6px solid #f4e8c8",
            boxShadow: "0 4px 10px rgba(0,0,0,.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "#7a5a30",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            transform: ROTATIONS[i % ROTATIONS.length],
            position: "relative",
          }}
          aria-label={p.caption}
        >
          {!p.src && p.caption}
        </div>
      ))}
    </section>
  );
}
