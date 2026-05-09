---
title: Orbit
date: 2025-11-12
dateDisplay: November 2025
stationName: Orbit Central
context: Texas Convergent Demo Day 2025 — Best Design Award
liveUrl: null
repoUrl: https://github.com/rehanmollick/IOT-ORBIT
description: >-
  Bluetooth-powered event networking app for UT students and recruiters at
  career fairs. Used at 12+ UT events. 9 fully-functional iOS screens
  implementing the Figma design pixel-perfectly, anchored by a signature
  animated "orb" visualization that represents networking connections forming
  in real time.
tags:
  - mobile
  - ble
  - iot
  - networking
  - award-winner
techStack:
  - name: React Native + Expo
    reason: >-
      Cross-platform mobile from one codebase. iOS-first launch but Android
      stays in reach for the full UT student body regardless of device.
  - name: React Native Skia
    reason: >-
      Powers the signature animated orb (pulse, shimmer, flowing-connection
      effects). Skia is the right tool when CSS-style animations can't hit
      the precision required for a real-time networking visualization.
  - name: Bluetooth Low Energy
    reason: >-
      Proximity detection without internet. Works in crowded venues like
      career fairs where WiFi is congested or unreliable.
  - name: Firebase Firestore
    reason: >-
      Real-time DB for instant profile exchanges when BLE proximity is
      detected. Firestore listeners make the "nearby people" list feel
      instant.
  - name: TypeScript
    reason: >-
      Type safety for the complex BLE event handling and connection state
      machine across the 9-screen flow.
slides:
  - { label: "orbit — splash + onboarding" }
  - { label: "nearby users — animated orb" }
  - { label: "profile exchange" }
  - { label: "event card" }
---
