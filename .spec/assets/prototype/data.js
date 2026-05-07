// ============================================================
// Portfolio data — matches src/data/projects.ts shape
// ============================================================
window.PROJECTS = [
  {
    id:"karmen-playground",
    title:"Karmen Playground",
    date:"2026-03-15",
    dateDisplay:"March 2026",
    stationName:"Karmen Junction",
    description:"Construction scheduling assistant with LLM integration and Monte Carlo risk analysis. Built as a demo for YC startup Karmen AI to showcase AI-powered project timeline optimization with probabilistic risk modeling.",
    slides:[
      {type:"placeholder",label:"karmen — hero screen"},
      {type:"placeholder",label:"karmen — schedule view"},
      {type:"placeholder",label:"karmen — monte-carlo risk"},
    ],
    liveUrl:null,
    repoUrl:"https://github.com/rehanmollick/karmen-playground",
    context:"Demo for YC Startup Karmen AI",
    techStack:[
      {name:"Next.js",reason:"Server components for secure API key handling and fast initial page load. App Router gave clean separation between scheduling UI and API routes."},
      {name:"FastAPI",reason:"Python backend for the Monte Carlo simulation engine. Async support handles concurrent simulation requests without blocking."},
      {name:"Gemini 2.5 Flash",reason:"Chosen over GPT-4 for cost efficiency and speed. Flash model handles natural language schedule parsing at sub-second latency."},
      {name:"TypeScript",reason:"Type safety across the frontend prevents runtime errors in the complex scheduling state management."},
      {name:"Tailwind CSS",reason:"Rapid UI iteration for the scheduling dashboard components."},
    ],
    tags:["ai","construction-tech","yc-demo","monte-carlo"],
    featured:true,
  },
  {
    id:"gridpulse",
    title:"GridPulse",
    date:"2026-01-20",
    dateDisplay:"January 2026",
    stationName:"GridPulse Station",
    description:"AI-powered grid dispatch tool that predicts demand spikes around UT Austin sports events and coordinates 4,200+ batteries at peak ERCOT pricing. Built for Base Power Company at TVG Hackathon.",
    slides:[
      {type:"placeholder",label:"gridpulse — dashboard"},
      {type:"placeholder",label:"ercot pricing chart"},
    ],
    liveUrl:null,
    repoUrl:"https://github.com/rehanmollick/gridpulse",
    context:"TVG Hackathon Spring 2026 — Built for Base Power",
    techStack:[
      {name:"Next.js",reason:"Real-time dashboard needed fast client-side updates while maintaining SSR for initial ERCOT pricing data load."},
      {name:"Groq",reason:"Chose Groq over OpenAI for sub-200ms inference latency. Coordinating 4,200 batteries needs fast dispatch."},
      {name:"JavaScript",reason:"Hackathon speed: JS let us iterate faster than TypeScript for a 24-hour build."},
      {name:"Python",reason:"Data pipeline for processing ERCOT pricing feeds and UT sports schedule correlation analysis."},
    ],
    tags:["hackathon","ai","energy","iot"],
  },
  {
    id:"flightsense",
    title:"FlightSense",
    date:"2026-01-12",
    dateDisplay:"January 2026",
    stationName:"FlightSense Terminal",
    description:"Solana-based flight delay prediction markets. Traders stake SOL on YES/NO outcomes using ML-powered disruption probability, targeting the $33B annual flight delay problem.",
    slides:[
      {type:"placeholder",label:"flightsense — market view"},
      {type:"placeholder",label:"stake flow"},
      {type:"placeholder",label:"ml delay model"},
      {type:"placeholder",label:"portfolio"},
    ],
    liveUrl:null,
    repoUrl:"https://github.com/rehanmollick/HackTamu26",
    context:"HackTAMU 2026",
    techStack:[
      {name:"Solana",reason:"Sub-second finality and near-zero fees make it viable for micro-stakes prediction markets. Ethereum L1 fees would kill the UX."},
      {name:"TypeScript",reason:"Anchor framework for Solana programs uses TypeScript for the client SDK. Consistent typing across frontend and blockchain."},
      {name:"Next.js",reason:"Prediction market UI needed real-time updates with SSR for SEO on market listing pages."},
      {name:"Python",reason:"ML model for flight delay probability trained on historical FAA data. scikit-learn served via a lightweight API."},
    ],
    tags:["hackathon","web3","solana","ml","prediction-markets"],
  },
  {
    id:"splitpay-escrow",
    title:"SplitPay Escrow",
    date:"2025-11-01",
    dateDisplay:"November 2025",
    stationName:"SplitPay Plaza",
    description:"Decentralized escrow dApp for freelance payments with automatic multi-party splits. Locks payments in a smart contract with deadline-based refunds.",
    slides:[{type:"placeholder",label:"splitpay — escrow flow"}],
    liveUrl:null,
    repoUrl:"https://github.com/rehanmollick/splitpay-escrow",
    context:null,
    techStack:[
      {name:"Solidity",reason:"Ethereum's smart contract language. The escrow logic (lock, release, refund, split) maps cleanly to Solidity's state machine patterns."},
      {name:"Next.js",reason:"Frontend for wallet connection (MetaMask), contract interaction, and payment status dashboard."},
      {name:"ethers.js",reason:"Lightweight Ethereum library. Chose over web3.js for smaller bundle size and cleaner TypeScript types."},
      {name:"Ethereum Sepolia",reason:"Testnet deployment for safe iteration. Reliable faucets and fast block times for dev."},
    ],
    tags:["web3","ethereum","defi","freelance"],
  },
  {
    id:"orbit",
    title:"Orbit",
    date:"2025-10-15",
    dateDisplay:"October 2025",
    stationName:"Orbit Central",
    description:"Bluetooth-powered event networking app used at 12+ UT events. Proximity-based connections for students and recruiters at career fairs. Won Best Design Award at Texas Convergent Demo Day.",
    slides:[
      {type:"placeholder",label:"orbit — nearby users"},
      {type:"placeholder",label:"profile exchange"},
    ],
    liveUrl:null,
    repoUrl:"https://github.com/mek-github/iot-bt-orbit",
    context:"Texas Convergent Demo Day 2025 — Best Design Award",
    techStack:[
      {name:"React Native",reason:"Cross-platform mobile from one codebase. Critical for the full UT student body regardless of device."},
      {name:"Firebase",reason:"Real-time DB for instant profile exchanges when BLE proximity is detected. Firestore listeners made nearby-people feel instant."},
      {name:"Bluetooth Low Energy",reason:"BLE beacons for proximity without internet. Works in crowded venues where WiFi is congested."},
      {name:"TypeScript",reason:"Type safety for the complex BLE event handling and state management across the connection lifecycle."},
    ],
    tags:["mobile","ble","iot","networking","award-winner"],
  },
  {
    id:"aegis-dashboard",
    title:"Aegis Insurance Dashboard",
    date:"2025-10-01",
    dateDisplay:"October 2025",
    stationName:"Aegis Exchange",
    description:"Full-stack insurance agency platform built in 24 hours. Features commission vesting, vault allocation, and chargeback processing.",
    slides:[{type:"placeholder",label:"aegis — dashboard"}],
    liveUrl:null,
    repoUrl:"https://github.com/AbdullahKabeer/hacktx25",
    context:"HackTX '25 — Built in 24 hours",
    techStack:[
      {name:"Next.js 15",reason:"Server actions for the commission calculation engine. Improved caching made the financial dashboards snappy."},
      {name:"TypeScript",reason:"Financial calculations demand type safety. A number/string confusion in commission math could cascade."},
      {name:"Tailwind CSS",reason:"Rapid prototyping for the dense dashboard UI. 24 hours meant zero time for custom CSS."},
    ],
    tags:["hackathon","fintech","insurance","dashboard"],
  },
  {
    id:"mp3-player",
    title:"Mp3 Player",
    date:"2025-06-01",
    dateDisplay:"June 2025",
    stationName:"Mp3 Junction",
    description:"Android MP3 player application built for an internship application. Clean playback interface with playlist management.",
    slides:[{type:"placeholder",label:"mp3 — playback"}],
    liveUrl:null,
    repoUrl:"https://github.com/rehanmollick/Mp3-Player",
    context:null,
    techStack:[
      {name:"TypeScript",reason:"Type-safe development for the audio playback state machine and playlist data structures."},
      {name:"React Native",reason:"Android deployment with the option to expand to iOS. Audio libraries handled playback controls cleanly."},
    ],
    tags:["mobile","android","audio","internship"],
  },
];

// Abandoned branches
window.BRANCHES = [];

// Blog / dispatches
window.DISPATCHES = [
  {
    slug:"building-rehanmd-tech",
    title:"Building rehanmd.tech",
    date:"2026-03-31",
    excerpt:"Every developer portfolio is a statement. Mine is a subway car.",
    tags:["meta","portfolio","react-three-fiber"],
    readTime:6,
    body:`
<p class="kicker">FROM THE WORKBENCH · VOL. I · ISSUE 01</p>
<h1 class="headline">Building rehanmd.tech</h1>
<p class="deck">Every developer portfolio is a statement. Mine is a subway car — procedurally generated, dimly lit, and always moving toward the next stop.</p>
<p class="byline">BY <span class="author">REHAN MOLLICK</span> · MARCH 31, 2026 · 6 MIN READ</p>
<div class="columns">
<p>I wanted something that felt like <em>movement</em> — the sense that you're going somewhere, that the next stop could change everything. A subway car is liminal space: you're between where you were and where you're going. That's what building software feels like to me.</p>
<h2>Why a Train?</h2>
<p>Most portfolios are catalogs. A grid of cards, a list of logos, a timeline laid flat on a page. They feel like LinkedIn with better typography. I wanted mine to feel like a <em>place</em>. Somewhere you could stand for a moment and take in the atmosphere before reading the résumé.</p>
<h2>The Stack</h2>
<p>The scene is built with <code>React Three Fiber</code>, which lets me write Three.js declaratively inside React. The train interior is entirely procedural — no 3D models, just code generating geometry. Every seat, pole, window, and ceiling panel is a <code>&lt;mesh&gt;</code> with a <code>&lt;boxGeometry&gt;</code> or <code>&lt;cylinderGeometry&gt;</code>.</p>
<p>Post-processing adds the atmosphere: bloom makes the tunnel lights glow, vignette darkens the edges, film grain adds texture, and a subtle depth of field blurs the far end of the tunnel. Camera shake makes it feel like the train is actually moving.</p>
<div class="pullquote">"I don't build portfolios to list credentials. I build them to show how I think."</div>
<h2>The Philosophy</h2>
<p>The projects section isn't a grid of cards — it's a metro line map, because every project is a stop on a journey. The blog section is a station wall with posters, because ideas are things you encounter in passing. Some catch your eye. Some you walk past. That's fine.</p>
<h2>What's Next</h2>
<p>This site will keep evolving. New projects become new stations on the map. New posts become new posters on the wall. The train keeps moving.</p>
</div>`,
  },
  {
    slug:"hello-world",
    title:"First Post",
    date:"2026-03-15",
    excerpt:"Welcome to my corner of the internet. This is where I'll post my build-notes from the high steppe.",
    tags:["meta"],
    readTime:2,
    body:`
<p class="kicker">DISPATCH · VOL. I · ISSUE 00</p>
<h1 class="headline">Hello, World.</h1>
<p class="deck">Welcome to the corner of the internet where build-notes, experiments, and half-formed ideas will live.</p>
<p class="byline">BY <span class="author">REHAN MOLLICK</span> · MARCH 15, 2026 · 2 MIN READ</p>
<div class="columns">
<p>Every blog needs a first post and this is mine. The plan here is simple: when I learn something worth writing down, I'll write it down. Expect notes on hackathon post-mortems, things I broke in production at 2am, weird edge cases I hit, and occasional rants about tooling.</p>
<p>No content calendar. No SEO. Just field notes from the platform.</p>
</div>`,
  },
];
