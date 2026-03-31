import Link from "next/link";
import Nav from "@/components/layout/Nav";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Blog — Md Rehan Mollick",
  description: "Field notes from the platform. Thoughts on building software, shipping fast, and the journey.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg-primary pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-mono text-2xl font-bold text-accent tracking-wider mb-2">
            Dispatches
          </h1>
          <p className="font-mono text-sm text-text-muted mb-12">
            Field notes from the platform.
          </p>

          {posts.length === 0 ? (
            <p className="text-text-muted font-mono text-sm">No posts yet.</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="border-l-2 border-bg-tertiary group-hover:border-accent pl-4 transition-colors">
                    <time className="font-mono text-xs text-text-muted">
                      {post.date}
                    </time>
                    <h2 className="font-mono text-lg text-text-primary group-hover:text-accent-light transition-colors mt-1">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] text-accent/60 px-1.5 py-0.5 rounded bg-bg-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
