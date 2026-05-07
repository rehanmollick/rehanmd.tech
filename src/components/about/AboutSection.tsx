"use client";

// About section — wheatpaste poster centered against the train backdrop.
// Click the poster to open the bulletin modal.

import { useState } from "react";
import { DEFAULT_ABOUT } from "@/lib/about";
import EnvelopePoster from "./EnvelopePoster";
import BulletinModal from "./BulletinModal";

export default function AboutSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="about"
      className="about-trigger-wrap"
      style={{
        padding: "120px 20px 140px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
        background:
          "radial-gradient(ellipse at center top, rgba(191,87,0,.05), transparent 60%), var(--page-outer)",
      }}
    >
      <EnvelopePoster onOpen={() => setOpen(true)} />
      <BulletinModal
        open={open}
        onClose={() => setOpen(false)}
        data={DEFAULT_ABOUT}
      />
    </section>
  );
}
