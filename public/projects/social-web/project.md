---
title: SocialWeb
date: 2026-04-13
dateDisplay: April 2026
stationName: Social Graph Terminal
context: null
liveUrl: null
repoUrl: https://github.com/rehanmollick/SocialWeb
description: >-
  Your social graph as memory. Drop a thought ("grabbed coffee with Sarah and
  Mike, talked about climbing"), Claude Haiku extracts the people, and a
  d3-force canvas visualization grows. People, mentions, and co-mention edges
  all persist in SQLite locally — your social memory lives on your machine,
  not in someone else's cloud.
tags:
  - ai
  - personal-knowledge
  - graph
  - claude
techStack:
  - name: Next.js 16 + Bun
    reason: >-
      App Router for the API routes; Bun for dev-server speed. Edge use case
      where Bun's startup time actually matters.
  - name: Anthropic Claude Haiku
    reason: >-
      Cheap, fast extraction of {name, bg, tags, strengthHint} from raw
      thoughts. A regex stub falls back when no API key is present so the
      loop still works offline.
  - name: Drizzle ORM + SQLite
    reason: >-
      Local-first DB so your social memory lives on your machine. Tables for
      people, thoughts, and mentions; co-mentions become graph edges.
  - name: d3-force
    reason: >-
      Canvas force simulation for the actual graph render. Buckets (plano, ut,
      allen, sf, family, climb, online) anchor clusters by color.
  - name: TypeScript + Tailwind v4
    reason: >-
      Type-safe extractor pipeline; Tailwind v4 for the canvas overlay UI.
slides:
  - { label: "social web — graph view" }
  - { label: "thought capture" }
  - { label: "person detail" }
---
