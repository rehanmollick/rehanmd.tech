---
title: Aegis Insurance Dashboard
date: 2025-10-01
dateDisplay: October 2025
stationName: Aegis Exchange
context: HackTX '25 — Built in 24 hours
liveUrl: null
repoUrl: https://github.com/AbdullahKabeer/hacktx25
description: >-
  Full-stack insurance agency platform built in 24 hours. Features commission
  vesting, vault allocation, and chargeback processing.
tags:
  - hackathon
  - fintech
  - insurance
  - dashboard
techStack:
  - name: Next.js 15
    reason: Server actions for the commission calculation engine. Improved caching made the financial dashboards snappy.
  - name: TypeScript
    reason: Financial calculations demand type safety. A number/string confusion in commission math could cascade.
  - name: Tailwind CSS
    reason: Rapid prototyping for the dense dashboard UI. 24 hours meant zero time for custom CSS.
slides:
  - { label: "aegis — dashboard" }
---
