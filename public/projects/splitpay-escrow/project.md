---
title: SplitPay Escrow
date: 2025-12-29
dateDisplay: December 2025
stationName: SplitPay Plaza
context: null
liveUrl: https://splitpay-escrow-13jh.vercel.app/
repoUrl: https://github.com/rehanmollick/splitpay-escrow
description: >-
  Decentralized escrow dApp for freelance and contract work, with automatic
  multi-party payment splits and deadline-based refunds. Built mainly because
  I wanted to actually learn Solidity and understand blockchain fundamentals
  from the ground up — the freelance-payments problem was a useful excuse to
  write a real smart contract that proves agreements on-chain instead of
  trusting a centralized escrow.
tags:
  - web3
  - ethereum
  - defi
  - solidity
  - learning
techStack:
  - name: Solidity
    reason: >-
      Ethereum's smart contract language. The escrow logic (lock, release,
      refund, split) maps cleanly to Solidity's state machine patterns.
      Picked it specifically to get hands-on with on-chain payment flows.
  - name: Remix IDE
    reason: >-
      Developed and tested the SplitPaymentEscrow contract directly in Remix
      on its virtual machine. Fastest feedback loop for learning Solidity
      without setting up a full local toolchain.
  - name: Next.js + TypeScript
    reason: >-
      Frontend for wallet connection (MetaMask), contract interaction, and
      the manage-by-address dashboard.
  - name: ethers.js
    reason: >-
      Lightweight Ethereum library. Smaller bundle than web3.js, cleaner
      TypeScript types for contract calls.
  - name: Ethereum Sepolia
    reason: >-
      Testnet deployment for safe iteration. Reliable faucets and fast block
      times — no real money at risk while learning.
slides:
  - { label: "splitpay — create escrow" }
  - { label: "deposit + manage flow" }
  - { label: "release + refund states" }
---
