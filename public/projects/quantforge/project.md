---
title: QuantForge
date: 2026-04-11
dateDisplay: April 2026
stationName: QuantForge Exchange
context: Momentum Genesis Yconic Buildathon — April 2026
liveUrl: https://frontend-gamma-ten-23.vercel.app
repoUrl: https://github.com/rehanmollick/mgyBuildathon
description: >-
  Trading strategy stress-testing platform. Describe a strategy in plain
  English, a six-agent AI pipeline parses it into executable Python, imagines
  200 synthetic market histories with a financial foundation model, runs the
  strategy across all of them, and tells you whether your edge is real or just
  survivorship bias. Dashboard surfaces return / drawdown / Sharpe
  distributions, probability of ruin, overfitting percentile, and a narrated
  AI verdict.
tags:
  - hackathon
  - ai
  - quant
  - agents
  - buildathon
techStack:
  - name: Six-agent AI pipeline (Claude)
    reason: >-
      Strategy Architect parses English → Python; Market Imaginer generates
      synthetic histories; Backtester runs pure compute; Analyst writes the
      verdict. Specialized agents > one giant prompt.
  - name: GBM + Kronos market generators
    reason: >-
      Two interchangeable foundation models for synthetic price paths.
      Swappable behind a typed interface so the pipeline stays generator-
      agnostic.
  - name: FastAPI + Python (mypy strict)
    reason: >-
      Strict-typed backend with a real pytest suite (≥80% coverage). Quant
      math demands type safety.
  - name: Next.js + TypeScript (strict)
    reason: >-
      Frontend with the live "Forge → Parse → Imagine → Test → Analyze"
      pipeline visualization. Strict TS so the API contract can't drift
      between Python and JS.
  - name: Web Speech API / VibeVoice-1.5B
    reason: >-
      Browser-native TTS for the narrated verdict in demo mode; streams real
      VibeVoice audio when a backend is attached. The pitch works even when
      the Colab GPU is asleep.
slides:
  - { label: "quantforge — strategy input" }
  - { label: "synthetic histories fan" }
  - { label: "overfitting percentile" }
  - { label: "evolve tab — strategy mutations" }
---
