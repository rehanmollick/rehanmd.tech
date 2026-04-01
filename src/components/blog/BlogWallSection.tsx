"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { BlogPosterData } from "@/components/three/MetroWallScene";

const MetroWallScene = dynamic(
  () => import("@/components/three/MetroWallScene"),
  { ssr: false }
);

interface BlogWallSectionProps {
  posts: BlogPosterData[];
}

function MobileBlogFallback({ posts }: { posts: BlogPosterData[] }) {
  return (
    <div className="px-6 pb-16 space-y-6 max-w-2xl mx-auto">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block group"
        >
          <article className="bg-bg-secondary border border-bg-tertiary rounded-lg p-5 hover:border-accent/40 transition-colors">
            <time className="font-mono text-xs text-text-muted">
              {post.date}
            </time>
            <h3 className="font-mono text-base text-text-primary group-hover:text-accent-light transition-colors mt-1">
              {post.title}
            </h3>
            <p className="text-text-secondary text-sm mt-2 leading-relaxed">
              {post.excerpt}
            </p>
            <span className="font-mono text-xs text-accent mt-3 inline-block">
              Read &rarr;
            </span>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default function BlogWallSection({ posts }: BlogWallSectionProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
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

      {mounted && isMobile ? (
        <MobileBlogFallback posts={posts} />
      ) : (
        <div className="w-full h-[70vh] md:h-[80vh]">
          {mounted && <MetroWallScene posts={posts} />}
        </div>
      )}
    </section>
  );
}
