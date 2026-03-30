# rehanmd.tech

Personal portfolio. Dark, immersive, 3D-heavy.

Built with Next.js, React Three Fiber, Framer Motion, and Tailwind CSS.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding Projects

Edit `src/data/projects.ts` and drop images in `public/projects/{id}/`.

## Adding Blog Posts

Create a `.mdx` file in `src/content/blog/` with frontmatter:

```mdx
---
title: "Post Title"
date: "2026-01-01"
tags: ["tag1", "tag2"]
excerpt: "Brief description."
---

Your content here.
```

## Deployment

Auto-deploys to Vercel on push to `main`.
