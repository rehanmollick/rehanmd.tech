// /blog/[slug] — newspaper reader for one MDX dispatch.
// No R3F train Canvas mounted here per .spec/03-train-scene-rules.md.

import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import NewspaperReader from "@/components/dispatches/NewspaperReader";
import { getAllPosts, getAllSlugs, getPostBySlug } from "@/lib/mdx";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Dispatch — rehanmd.tech" };
  return {
    title: `${post.title} — The Platform Gazette`,
    description: post.excerpt,
  };
}

export default async function DispatchPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Resolve issue number — newest first, so dispatch №01 is the most recent.
  const all = getAllPosts();
  const index = all.findIndex((p) => p.slug === slug);

  return (
    <>
      <Nav />
      <NewspaperReader post={post} index={index} total={all.length} />
    </>
  );
}
