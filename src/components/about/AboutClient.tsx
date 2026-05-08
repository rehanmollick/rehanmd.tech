"use client";

// Client wrapper for the about section — owns the modal open/close state.
// The parent <AboutSection> is a server component that reads DEFAULT_ABOUT
// from the filesystem and passes it down here as a prop.

import { useState } from "react";
import type { AboutConfig } from "@/lib/about";
import EnvelopePoster from "./EnvelopePoster";
import BulletinModal from "./BulletinModal";

export default function AboutClient({ data }: { data: AboutConfig }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <EnvelopePoster onOpen={() => setOpen(true)} />
      <BulletinModal open={open} onClose={() => setOpen(false)} data={data} />
    </>
  );
}
