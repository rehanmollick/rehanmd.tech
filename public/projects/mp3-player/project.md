---
title: Mp3 Player
date: 2025-11-15
dateDisplay: November 2025
stationName: Native Bridge Junction
context: null
liveUrl: null
repoUrl: https://github.com/rehanmollick/Mp3-Player
description: >-
  Native Android audio player built in React Native that demonstrates
  cross-language bridging between TypeScript and Java via React Native's
  Native Modules API. The point isn't the audio player — it's the bridge.
  A custom Java module annotated with @ReactMethod exposes Android's
  MediaPlayer API to the JS layer through Promises, with a typed TypeScript
  wrapper on the other side. Built without Expo Go so the native module
  pattern actually applies.
tags:
  - mobile
  - android
  - react-native
  - native-bridge
  - internship
techStack:
  - name: React Native (bare workflow, no Expo)
    reason: >-
      Bare workflow needed because Expo Go doesn't expose custom native
      modules. The whole point of the project was talking to Android-native
      APIs that the JS layer can't reach on its own.
  - name: Java (Android)
    reason: >-
      Custom AudioPlayerModule with @ReactMethod-annotated methods that
      React Native discovers and exposes to JS. Backed by Android's native
      MediaPlayer API.
  - name: TypeScript
    reason: >-
      Type-safe wrapper around the bridge so the JS side never has to think
      about Java's calling conventions or promise resolution paths.
  - name: React Native Native Modules API
    reason: >-
      The actual bridge. @ReactMethod + Promise on the Java side plus
      NativeModules import on the JS side. Module registration via
      AudioPlayerPackage so RN can find it at runtime.
slides:
  - { label: "mp3 — playback ui" }
  - { label: "native bridge architecture" }
  - { label: "java module — @ReactMethod" }
---
