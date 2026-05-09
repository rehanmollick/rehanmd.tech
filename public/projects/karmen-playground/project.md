---
title: Karmen Playground
date: 2026-03-21
dateDisplay: March 2026
stationName: Karmen Junction
context: Demo for YC Startup Karmen AI
liveUrl: https://karmen-playground.vercel.app/
repoUrl: https://github.com/rehanmollick/karmen-playground
featured: true
description: >-
  Construction scheduling assistant with smart LLM integration. Demo built for
  YC startup Karmen AI to showcase AI-powered project timeline parsing and
  Monte Carlo risk analysis. The live demo's GPU backend is intentionally
  scaled to zero to avoid 24/7 idle billing — message me to spin it back up.
tags:
  - ai
  - construction-tech
  - yc-demo
  - monte-carlo
techStack:
  - name: Next.js (App Router)
    reason: >-
      Server components for secure API key handling and fast initial page
      load. App Router gave clean separation between scheduling UI and API
      routes.
  - name: FastAPI
    reason: >-
      Python backend for the Monte Carlo simulation engine. Async support
      handles concurrent simulation requests without blocking.
  - name: Gemini 2.5 Flash
    reason: >-
      Chosen over GPT-4 for cost efficiency and speed. Flash model handles
      natural language schedule parsing at sub-second latency.
  - name: TypeScript
    reason: >-
      Type safety across the frontend prevents runtime errors in the complex
      scheduling state management.
  - name: Tailwind CSS
    reason: Rapid UI iteration for the scheduling dashboard components.
slides:
  - { label: "karmen — hero screen" }
  - { label: "karmen — schedule view" }
  - { label: "karmen — monte-carlo risk" }
---
