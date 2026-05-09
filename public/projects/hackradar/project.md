---
title: HackRadar
date: 2026-04-07
dateDisplay: April 2026
stationName: HackRadar Outpost
context: null
liveUrl: null
repoUrl: https://github.com/rehanmollick/HackRadar
description: >-
  Daily AI scraper that surfaces the best emerging hackathon ideas. A GitHub
  Actions cron hits 25 sources (Hugging Face datasets, OpenAI research,
  Stability blog, Product Hunt, etc.), Gemini 2.5 Flash scores each one, and
  a top-15 ranked digest lands in your inbox every morning. V2 turns it
  interactive — a local-first FastAPI + Next.js platform where you can rerun
  with a focus, ask follow-ups on a find, and surface broken scrapers
  instead of failing silently.
tags:
  - ai
  - tooling
  - personal-tool
  - gemini
techStack:
  - name: GitHub Actions cron
    reason: >-
      Runs the daily scrape + score + email pipeline even when the laptop is
      off. Free for public repos; perfect for a 6 AM digest.
  - name: Gemini 2.5 Flash
    reason: >-
      Cheap and fast for the bulk-scoring pass. V2 swaps to better models for
      the high-ranked items where the analysis quality matters more.
  - name: FastAPI + SQLite (V2)
    reason: >-
      V2 control surface so the email isn't fire-and-forget anymore. SQLite
      keeps the whole platform local-first — runs on your home PC.
  - name: Next.js frontend (V2)
    reason: >-
      Dashboard for filtering by date, rerunning with a new focus,
      expanding any find for deeper analysis.
  - name: pytest suite (88 tests)
    reason: >-
      Coverage on the scrape + score pipeline so silent scraper failures get
      loud. V1 had ~10/25 sources fail silently between runs — V2 fixes that.
slides:
  - { label: "hackradar — daily digest email" }
  - { label: "v2 dashboard — top finds" }
  - { label: "follow-up chat on a find" }
---
