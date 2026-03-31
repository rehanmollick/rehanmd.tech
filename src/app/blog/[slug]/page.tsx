import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import Nav from "@/components/layout/Nav";
import mdxComponents from "@/components/blog/MDXComponents";
import { getPostBySlug, getAllSlugs } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — Md Rehan Mollick`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-bg-primary pt-24 pb-16 px-6">
        <article className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="font-mono text-xs text-text-muted hover:text-accent-light transition-colors mb-8 inline-block"
          >
            &larr; All posts
          </Link>

          {/* Header */}
          <header className="mb-8">
            <time className="font-mono text-xs text-text-muted block mb-2">
              {post.date}
            </time>
            <h1 className="font-mono text-2xl md:text-3xl font-bold text-text-primary">
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <div className="flex gap-2 mt-3">
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
          </header>

          {/* MDX Content */}
          <div className="prose-custom">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeHighlight],
                },
              }}
              components={mdxComponents}
            />
          </div>

          {/* Footer */}
          <div className="mt-16 pt-6 border-t border-bg-tertiary">
            <Link
              href="/blog"
              className="font-mono text-sm text-text-muted hover:text-accent-light transition-colors"
            >
              &larr; Back to all posts
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
