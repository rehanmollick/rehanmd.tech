"use client";

import AboutCard from "./AboutCard";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-4 py-24 pointer-events-none"
    >
      {/* Card itself captures pointer events; transparent area passes through to train */}
      <div className="pointer-events-auto">
        <AboutCard />
      </div>
    </section>
  );
}
