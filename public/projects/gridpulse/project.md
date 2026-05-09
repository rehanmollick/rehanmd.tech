---
title: GridPulse
date: 2026-02-21
dateDisplay: February 2026
stationName: GridPulse Station
context: TVG Hackathon Spring 2026 — Built for Base Power
liveUrl: null
repoUrl: https://github.com/rehanmollick/gridpulse
description: >-
  Real-time battery dispatch operator command center for the Austin grid.
  Watches UT Austin sports events, forecasts neighborhood-level demand spikes
  (80–190%), and tells Base Power's fleet of 4,200 residential batteries
  exactly when and where to pre-position and discharge. Every dispatch is
  backed by live ERCOT pricing and AI-generated operator briefs.
tags:
  - hackathon
  - ai
  - energy
  - iot
techStack:
  - name: Next.js
    reason: >-
      Real-time dashboard needed fast client-side updates while maintaining
      SSR for the initial ERCOT pricing data load.
  - name: Groq
    reason: >-
      Sub-200ms inference latency. Coordinating 4,200 batteries needs fast
      dispatch — Groq beat OpenAI on response time during the hackathon.
  - name: JavaScript
    reason: >-
      Hackathon speed — JS let us iterate faster than TypeScript for a
      24-hour build. Every minute counted.
  - name: Python
    reason: >-
      Data pipeline for processing ERCOT pricing feeds and the UT sports
      schedule correlation analysis (event → expected demand spike per zip
      code).
slides:
  - { label: "gridpulse — dispatch dashboard" }
  - { label: "ai operator brief" }
  - { label: "ercot pricing chart" }
  - { label: "dispatch command log" }
---
