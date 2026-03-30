export interface TechItem {
  name: string;
  icon?: string; // lucide icon name or custom
  reason: string; // Why this technology was chosen
}

export interface Project {
  id: string;
  title: string;
  date: string; // ISO date string for sorting
  dateDisplay: string; // Human-readable date
  description: string;
  slides: string[]; // Paths to images/GIFs in public/projects/{id}/
  liveUrl?: string; // Deployed URL (if exists)
  repoUrl: string; // GitHub repo URL
  techStack: TechItem[];
  tags: string[]; // For filtering/categorization
  context?: string; // e.g. "HackTAMU 2026", "Texas Convergent Demo Day"
}

export const projects: Project[] = [
  // ========================================
  // NEWEST FIRST (chronological descending)
  // ========================================

  {
    id: "karmen-playground",
    title: "Karmen Playground",
    date: "2026-03-15",
    dateDisplay: "March 2026",
    description:
      "Construction scheduling assistant with LLM integration and Monte Carlo risk analysis. Built as a demo for YC startup Karmen AI to showcase AI-powered project timeline optimization with probabilistic risk modeling.",
    slides: [
      "/projects/karmen-playground/slide1.png",
      // Add more as you take screenshots
    ],
    liveUrl: undefined, // Add when deployed
    repoUrl: "https://github.com/rehanmollick/karmen-playground",
    techStack: [
      {
        name: "Next.js",
        reason:
          "Needed server components for secure API key handling and fast initial page load. App Router gave clean separation between the scheduling UI and API routes.",
      },
      {
        name: "FastAPI",
        reason:
          "Python backend for the Monte Carlo simulation engine. FastAPI's async support handles concurrent simulation requests without blocking.",
      },
      {
        name: "Gemini 2.5 Flash",
        reason:
          "Chosen over GPT-4 for cost efficiency and speed. Flash model handles natural language schedule parsing at sub-second latency, critical for interactive UX.",
      },
      {
        name: "TypeScript",
        reason:
          "Type safety across the frontend prevents runtime errors in the complex scheduling state management.",
      },
      {
        name: "Tailwind CSS",
        reason: "Rapid UI iteration for the scheduling dashboard components.",
      },
    ],
    tags: ["ai", "construction-tech", "yc-demo", "monte-carlo"],
    context: "Demo for YC Startup Karmen AI",
  },

  {
    id: "gridpulse",
    title: "GridPulse",
    date: "2026-01-20",
    dateDisplay: "January 2026",
    description:
      "AI-powered grid dispatch tool that predicts demand spikes around UT Austin sports events and coordinates 4,200+ batteries at peak ERCOT pricing. Built for Base Power Company at TVG Hackathon.",
    slides: [
      "/projects/gridpulse/slide1.png",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/rehanmollick/gridpulse",
    techStack: [
      {
        name: "Next.js",
        reason:
          "Real-time dashboard needed fast client-side updates while maintaining SSR for the initial data load of ERCOT pricing history.",
      },
      {
        name: "Groq",
        reason:
          "Chose Groq over OpenAI for sub-200ms inference latency. When coordinating 4,200 batteries, dispatch decisions need to happen fast.",
      },
      {
        name: "JavaScript",
        reason:
          "Hackathon speed: JS let us iterate faster than TypeScript for a 24-hour build. Every minute counted.",
      },
      {
        name: "Python",
        reason:
          "Data pipeline for processing ERCOT pricing feeds and UT sports schedule correlation analysis.",
      },
    ],
    tags: ["hackathon", "ai", "energy", "iot"],
    context: "TVG Hackathon Spring 2026 — Built for Base Power Company",
  },

  {
    id: "flightsense",
    title: "FlightSense",
    date: "2026-01-12",
    dateDisplay: "January 2026",
    description:
      "Solana-based flight delay prediction markets. Traders stake SOL on YES/NO outcomes using ML-powered disruption probability, targeting the $33B annual flight delay problem.",
    slides: [
      "/projects/flightsense/slide1.png",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/rehanmollick/HackTamu26",
    techStack: [
      {
        name: "Solana",
        reason:
          "Sub-second finality and near-zero fees make it viable for micro-stakes prediction markets. Ethereum L1 fees would kill the UX for small bets.",
      },
      {
        name: "TypeScript",
        reason:
          "Anchor framework for Solana programs uses TypeScript for the client SDK. Consistent typing across frontend and blockchain interaction.",
      },
      {
        name: "Next.js",
        reason:
          "The prediction market UI needed real-time updates (market odds changing) with SSR for SEO on market listing pages.",
      },
      {
        name: "Python",
        reason:
          "ML model for flight delay probability trained on historical FAA data. scikit-learn for the classifier, served via a lightweight API.",
      },
    ],
    tags: ["hackathon", "web3", "solana", "ml", "prediction-markets"],
    context: "HackTAMU 2026",
  },

  {
    id: "splitpay-escrow",
    title: "SplitPay Escrow",
    date: "2025-11-01",
    dateDisplay: "November 2025",
    description:
      "Decentralized escrow dApp for freelance payments with automatic multi-party splits. Locks payments in a smart contract with deadline-based refunds.",
    slides: [
      "/projects/splitpay-escrow/slide1.png",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/rehanmollick/splitpay-escrow",
    techStack: [
      {
        name: "Solidity",
        reason:
          "Ethereum's smart contract language. The escrow logic (lock, release, refund, split) maps cleanly to Solidity's state machine patterns.",
      },
      {
        name: "Next.js",
        reason:
          "Frontend for wallet connection (MetaMask), contract interaction, and payment status dashboard.",
      },
      {
        name: "ethers.js",
        reason:
          "Lightweight Ethereum library for contract calls. Chose over web3.js for smaller bundle size and cleaner TypeScript types.",
      },
      {
        name: "Ethereum Sepolia",
        reason:
          "Testnet deployment for safe iteration. Sepolia has reliable faucets and fast block times for development.",
      },
    ],
    tags: ["web3", "ethereum", "defi", "freelance"],
  },

  {
    id: "orbit",
    title: "Orbit",
    date: "2025-10-15",
    dateDisplay: "October 2025",
    description:
      "Bluetooth-powered event networking app used at 12+ UT events. Proximity-based connections for students and recruiters at career fairs. Won Best Design Award at Texas Convergent Demo Day.",
    slides: [
      "/projects/orbit/slide1.png",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/mek-github/iot-bt-orbit",
    techStack: [
      {
        name: "React Native",
        reason:
          "Cross-platform mobile app (iOS + Android) from one codebase. Critical for reaching the full UT student body regardless of device.",
      },
      {
        name: "Firebase",
        reason:
          "Real-time database for instant profile exchanges when Bluetooth proximity is detected. Firestore's real-time listeners made the 'nearby people' list feel instant.",
      },
      {
        name: "Bluetooth Low Energy",
        reason:
          "BLE beacons for proximity detection without requiring internet. Works in crowded venues where WiFi is congested.",
      },
      {
        name: "TypeScript",
        reason:
          "Type safety for the complex BLE event handling and state management across the connection lifecycle.",
      },
    ],
    tags: ["mobile", "ble", "iot", "networking", "award-winner"],
    context: "Texas Convergent Demo Day 2025 — Won Best Design Award",
  },

  {
    id: "aegis-dashboard",
    title: "Aegis Insurance Dashboard",
    date: "2025-10-01",
    dateDisplay: "October 2025",
    description:
      "Full-stack insurance agency platform built in 24 hours. Features commission vesting, vault allocation, and chargeback processing.",
    slides: [
      "/projects/aegis-dashboard/slide1.png",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/AbdullahKabeer/hacktx25",
    techStack: [
      {
        name: "Next.js 15",
        reason:
          "Needed server actions for the commission calculation engine. Next.js 15's improved caching made the financial dashboards snappy.",
      },
      {
        name: "TypeScript",
        reason:
          "Financial calculations demand type safety. A single number/string confusion in commission math could cascade into bad data.",
      },
      {
        name: "Tailwind CSS",
        reason:
          "Rapid prototyping for the dense dashboard UI. 24-hour hackathon meant zero time for custom CSS architecture.",
      },
    ],
    tags: ["hackathon", "fintech", "insurance", "dashboard"],
    context: "HackTX '25 — Built in 24 hours",
  },

  {
    id: "mp3-player",
    title: "Mp3 Player",
    date: "2025-06-01",
    dateDisplay: "June 2025",
    description:
      "Android MP3 player application built for an internship application. Clean playback interface with playlist management.",
    slides: [
      "/projects/mp3-player/slide1.png",
    ],
    liveUrl: undefined,
    repoUrl: "https://github.com/rehanmollick/Mp3-Player",
    techStack: [
      {
        name: "TypeScript",
        reason:
          "Type-safe development for the audio playback state machine and playlist data structures.",
      },
      {
        name: "React Native",
        reason:
          "Targeted Android deployment with the option to expand to iOS. React Native's audio libraries handled playback controls cleanly.",
      },
    ],
    tags: ["mobile", "android", "audio", "internship"],
  },
];
