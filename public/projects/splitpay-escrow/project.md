---
title: SplitPay Escrow
date: 2025-11-01
dateDisplay: November 2025
stationName: SplitPay Plaza
context: null
liveUrl: null
repoUrl: https://github.com/rehanmollick/splitpay-escrow
description: >-
  Decentralized escrow dApp for freelance payments with automatic multi-party
  splits. Locks payments in a smart contract with deadline-based refunds.
tags:
  - web3
  - ethereum
  - defi
  - freelance
techStack:
  - name: Solidity
    reason: >-
      Ethereum's smart contract language. The escrow logic (lock, release,
      refund, split) maps cleanly to Solidity's state machine patterns.
  - name: Next.js
    reason: Frontend for wallet connection (MetaMask), contract interaction, and payment status dashboard.
  - name: ethers.js
    reason: >-
      Lightweight Ethereum library. Chose over web3.js for smaller bundle size
      and cleaner TypeScript types.
  - name: Ethereum Sepolia
    reason: Testnet deployment for safe iteration. Reliable faucets and fast block times for dev.
slides:
  - { label: "splitpay — escrow flow" }
---
