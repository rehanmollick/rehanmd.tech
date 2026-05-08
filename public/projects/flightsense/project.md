---
title: FlightSense
date: 2026-01-12
dateDisplay: January 2026
stationName: FlightSense Terminal
context: HackTAMU 2026
liveUrl: null
repoUrl: https://github.com/rehanmollick/HackTamu26
description: >-
  Solana-based flight delay prediction markets. Traders stake SOL on YES/NO
  outcomes using ML-powered disruption probability, targeting the $33B annual
  flight delay problem.
tags:
  - hackathon
  - web3
  - solana
  - ml
  - prediction-markets
techStack:
  - name: Solana
    reason: >-
      Sub-second finality and near-zero fees make it viable for micro-stakes
      prediction markets. Ethereum L1 fees would kill the UX.
  - name: TypeScript
    reason: >-
      Anchor framework for Solana programs uses TypeScript for the client SDK.
      Consistent typing across frontend and blockchain.
  - name: Next.js
    reason: Prediction market UI needed real-time updates with SSR for SEO on market listing pages.
  - name: Python
    reason: >-
      ML model for flight delay probability trained on historical FAA data.
      scikit-learn served via a lightweight API.
slides:
  - { label: "flightsense — market view" }
  - { label: "stake flow" }
  - { label: "ml delay model" }
  - { label: "portfolio" }
---
