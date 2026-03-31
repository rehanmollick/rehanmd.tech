"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import type { BlogPosterData } from "@/components/three/MetroWallScene";

const MetroWallScene = dynamic(
  () => import("@/components/three/MetroWallScene"),
  { ssr: false }
);

interface BlogWallSectionProps {
  posts: BlogPosterData[];
}

export default function BlogWallSection({ posts }: BlogWallSectionProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for poster click events from the 3D scene
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail?.slug;
      if (slug) {
        router.push(`/blog/${slug}`);
      }
    };
    window.addEventListener("poster-click-blog", handler);
    return () => window.removeEventListener("poster-click-blog", handler);
  }, [router]);

  return (
    <section id="blog" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Section heading */}
      <div className="px-6 pt-24 pb-8 max-w-6xl mx-auto">
        <h2 className="font-mono text-2xl font-bold text-accent tracking-wider">
          Dispatches
        </h2>
        <p className="font-mono text-sm text-text-muted mt-2">
          Field notes from the platform.
        </p>
      </div>

      {/* 3D metro station wall */}
      <div className="w-full h-[70vh] md:h-[80vh]">
        {mounted && <MetroWallScene posts={posts} />}
      </div>
    </section>
  );
}
