---
title: Orbit
date: 2025-10-22
dateDisplay: October 2025
stationName: Orbit Central
context: Texas Convergent Demo Day 2025 — Best Design Award
liveUrl: null
repoUrl: https://github.com/mek-github/iot-bt-orbit
description: >-
  Bluetooth-powered event networking app for UT students and recruiters at
  career fairs. Reimagines how people meet at networking events through
  proximity-based discovery, a signature animated orbit visualization, and
  real-time Firebase-backed event management. Built for Texas Convergent
  Demo Day 2025.
tags:
  - mobile
  - ios
  - networking
  - firebase
  - team-build
  - award-winner
techStack:
  - name: React Native + Expo
    reason: >-
      Expo 54 + React Native 0.76 — cross-platform mobile from a single
      codebase. iOS-first launch but Android stays in reach. Expo's managed
      workflow let the team move fast through demo day prep.
  - name: TypeScript
    reason: >-
      Type safety for the connection state machine, the proximity-detection
      pipeline, and the Firestore document shapes. Catches refactors when
      multiple people are touching the same screens.
  - name: Firebase (Firestore + Auth + Storage)
    reason: >-
      Real-time Firestore for live event updates and check-ins; Firebase Auth
      for student/recruiter accounts; Storage for profile photos. One service
      handles the entire backend so the team could focus on the UX.
  - name: React Navigation
    reason: >-
      Navigation across the splash, browse, profile, event detail, and
      post-event recap screens. Stack + bottom tabs blended cleanly.
  - name: React Native Animated API
    reason: >-
      Powers the signature orbit visualization (pulse, shimmer, flowing
      connections). Animated runs on the native driver so the visualization
      doesn't drop frames during scroll or screen transitions.
  - name: Bluetooth-inspired proximity model
    reason: >-
      A simulated proximity layer modeled on BLE behavior — works reliably
      in crowded venues where actual radio scanning would be flaky and
      battery-hungry. Demo-day-grade reliability without permission prompts.
slides:
  - { label: "orbit — splash + onboarding" }
  - { label: "browse events" }
  - { label: "orbit visualization — connections forming" }
  - { label: "post-event recap" }
---
