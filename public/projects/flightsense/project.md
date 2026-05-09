---
title: FlightSense
date: 2026-01-24
dateDisplay: January 2026
stationName: FlightSense Terminal
context: HackTAMU 2026
liveUrl: null
repoUrl: https://github.com/rehanmollick/HackTamu26
description: >-
  Decentralized flight delay prediction markets on Solana. Traders stake SOL
  on YES/NO outcomes using ML-powered disruption probability, targeting the
  $33B annual flight delay problem. Airlines get free hyper-accurate
  predictions from the crowd; passengers make better travel decisions; traders
  profit from their research.
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
      prediction markets. Ethereum L1 fees would kill the UX for small bets.
  - name: TypeScript
    reason: >-
      Anchor framework for Solana programs uses TypeScript for the client
      SDK. Consistent typing across frontend and blockchain interaction.
  - name: Next.js
    reason: >-
      Prediction market UI needed real-time updates with SSR for SEO on
      market listing pages.
  - name: Python
    reason: >-
      ML model for flight delay probability trained on historical FAA data.
      scikit-learn served via a lightweight API.
  - name: Supabase
    reason: >-
      Off-chain market metadata and user portfolio state. Postgres with
      real-time subscriptions for live odds updates.
slides:
  - { label: "flightsense — market view" }
  - { label: "stake flow" }
  - { label: "ml delay model" }
  - { label: "portfolio" }
---
