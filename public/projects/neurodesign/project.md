---
title: NeuroDesign
date: 2026-04-04
dateDisplay: April 2026
stationName: NeuroDesign Lab
context: Won 'Most Creative' Track — Claude Builder Club Hackathon at UT Austin
liveUrl: https://neurodesign-v2.vercel.app/
repoUrl: https://github.com/rehanmollick/NeuroDesignV2
description: >-
  Neuroscience-backed A/B testing for designers. Upload two images, see how
  the human brain actually responds to each one, and get AI recommendations
  grounded in real fMRI research instead of designer guesswork. V2 is a
  ground-up rewrite of the V1 hackathon build with multimodal AI (Gemini 2.5
  Flash sees the images alongside the brain data), six high-level composite
  signals derived from the 74-region Destrieux atlas, a neuroscience RAG
  knowledge base, and a chat advisor that stays consistent with the verdict.
tags:
  - hackathon
  - award-winner
  - ai
  - neuroscience
  - multimodal
techStack:
  - name: Meta TRIBE v2 (fMRI prediction)
    reason: >-
      Predicts ~20,000 cortical activation values per image. Runs on a Modal
      T4 GPU, ~60s per image. The whole project is built on top of this
      model's predictions.
  - name: Gemini 2.5 Flash (multimodal)
    reason: >-
      Sees both designs side-by-side WITH the brain data and writes the
      verdict. V1 used text-only Gemma 4 fed region summaries; V2's
      multimodal upgrade made verdicts dramatically more grounded.
  - name: Custom neuroscience RAG knowledge base
    reason: >-
      Region-function explanations come from a curated knowledge base
      (backend/neuro_knowledge.py) instead of being hallucinated from
      scratch. Region descriptions stay accurate and consistent.
  - name: Three.js / fsaverage5 cortical mesh
    reason: >-
      Interactive 3D brain heatmap with ~20k vertices and per-vertex
      activation coloring. Aggregated up into 74 named Destrieux regions.
  - name: Modal (serverless GPU)
    reason: >-
      On-demand T4 inference. V2 defaults to scale-to-zero after a billing
      scare in V1 where a warm container ran 24/7 regardless of traffic.
  - name: Next.js + FastAPI
    reason: >-
      Streaming compare endpoint so results appear in stages instead of one
      long block. Client-side image resize cuts upload size and GPU memory
      pressure.
slides:
  - { label: "neurodesign — preset comparison" }
  - { label: "3d brain heatmap" }
  - { label: "composite signal breakdown" }
  - { label: "ai verdict + chat advisor" }
---
