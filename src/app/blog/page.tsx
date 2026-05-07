// /blog — full-page newsstand wall. No R3F Canvas mounted on this route
// (per .spec/03-train-scene-rules.md). Re-uses the homepage DispatchesSection
// for visual consistency.

import Nav from "@/components/layout/Nav";
import DispatchesSection from "@/components/dispatches/DispatchesSection";
import Footer from "@/components/layout/Footer";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Dispatches — rehanmd.tech",
  description: "Field notes from the platform.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: "100vh",
          background: "var(--page-outer)",
          paddingTop: 80,
        }}
      >
        <DispatchesSection posts={posts} />
        <Footer />
      </main>
    </>
  );
}
