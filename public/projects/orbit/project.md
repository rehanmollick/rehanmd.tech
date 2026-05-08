---
title: Orbit
date: 2025-10-15
dateDisplay: October 2025
stationName: Orbit Central
context: Texas Convergent Demo Day 2025 — Best Design Award
liveUrl: null
repoUrl: https://github.com/mek-github/iot-bt-orbit
description: >-
  Bluetooth-powered event networking app used at 12+ UT events. Proximity-based
  connections for students and recruiters at career fairs. Won Best Design
  Award at Texas Convergent Demo Day.
tags:
  - mobile
  - ble
  - iot
  - networking
  - award-winner
techStack:
  - name: React Native
    reason: Cross-platform mobile from one codebase. Critical for the full UT student body regardless of device.
  - name: Firebase
    reason: >-
      Real-time DB for instant profile exchanges when BLE proximity is detected.
      Firestore listeners made nearby-people feel instant.
  - name: Bluetooth Low Energy
    reason: BLE beacons for proximity without internet. Works in crowded venues where WiFi is congested.
  - name: TypeScript
    reason: Type safety for the complex BLE event handling and state management across the connection lifecycle.
slides:
  - { label: "orbit — nearby users" }
  - { label: "profile exchange" }
---
