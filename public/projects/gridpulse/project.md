---
title: GridPulse
date: 2026-01-20
dateDisplay: January 2026
stationName: GridPulse Station
context: TVG Hackathon Spring 2026 — Built for Base Power
liveUrl: null
repoUrl: https://github.com/rehanmollick/gridpulse
description: >-
  AI-powered grid dispatch tool that predicts demand spikes around UT Austin
  sports events and coordinates 4,200+ batteries at peak ERCOT pricing. Built
  for Base Power Company at TVG Hackathon.
tags:
  - hackathon
  - ai
  - energy
  - iot
techStack:
  - name: Next.js
    reason: >-
      Real-time dashboard needed fast client-side updates while maintaining SSR
      for initial ERCOT pricing data load.
  - name: Groq
    reason: >-
      Chose Groq over OpenAI for sub-200ms inference latency. Coordinating
      4,200 batteries needs fast dispatch.
  - name: JavaScript
    reason: Hackathon speed — JS let us iterate faster than TypeScript for a 24-hour build.
  - name: Python
    reason: Data pipeline for processing ERCOT pricing feeds and UT sports schedule correlation analysis.
slides:
  - { label: "gridpulse — dashboard" }
  - { label: "ercot pricing chart" }
---
