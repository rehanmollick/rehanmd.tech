"use client";

import { useEffect, useState, useCallback } from "react";
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

interface PosterDetail {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

function BlogPostOverlay({
  post,
  onClose,
}: {
  post: PosterDetail;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 border border-accent/30 bg-bg-secondary/95 backdrop-blur-md rounded-lg max-w-lg w-full mx-4 shadow-2xl"
        style={{ padding: "32px 36px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-text-muted hover:text-text-primary transition-colors font-mono text-lg"
        >
          &times;
        </button>

        <time className="font-mono text-xs text-text-muted">{post.date}</time>
        <h3 className="font-mono text-xl font-bold text-text-primary mt-1 mb-4 pr-6">
          {post.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          {post.excerpt}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-accent text-accent font-mono text-sm hover:bg-accent hover:text-bg-primary transition-colors"
        >
          Read Full Post &rarr;
        </Link>

        <p className="font-mono text-xs text-text-muted mt-5 text-center">
          click anywhere to close
        </p>
      </div>
    </div>
  );
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
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PosterDetail | null>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Listen for poster click events from the 3D scene — show popup
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.slug) {
        setSelectedPost({
          slug: detail.slug,
          title: detail.title,
          date: detail.date,
          excerpt: detail.excerpt,
        });
      }
    };
    window.addEventListener("poster-click-blog", handler);
    return () => window.removeEventListener("poster-click-blog", handler);
  }, []);

  const closeOverlay = useCallback(() => setSelectedPost(null), []);

  return (
    <>
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

      {/* Popup overlay when a poster is clicked */}
      {selectedPost && (
        <BlogPostOverlay post={selectedPost} onClose={closeOverlay} />
      )}
    </>
  );
}
