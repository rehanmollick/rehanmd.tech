"use client";

import AboutCard from "./AboutCard";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-24 pointer-events-none"
    >
      {/* Card itself captures pointer events; transparent area passes through to train */}
      <div className="pointer-events-auto">
        <AboutCard />
      </div>

      {/* Scroll hint — far below the card */}
      <div style={{ marginTop: "300px" }}>
        <div className="font-mono text-sm text-text-muted tracking-widest uppercase animate-pulse">
          Scroll
        </div>
      </div>
    </section>
  );
}
