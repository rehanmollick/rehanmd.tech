import type { Metadata } from "next";
import {
  Press_Start_2P,
  JetBrains_Mono,
  Playfair_Display,
  Source_Serif_4,
  Special_Elite,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SessionProviderClient from "@/components/providers/SessionProviderClient";
import "@/styles/globals.css";

// Pixel display face — used for hero h1, section h2, plaque title, footer LET'S DO IT,
// station signs, admin h2. Per user confirmation: keep Press Start 2P (not the prototype's VT323).
const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

// Mono — eyebrows, meta, admin UI, badges, code chips
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Display serif (italic-capable) — bulletin title, newspaper masthead, headlines, drop caps
const serif = Playfair_Display({
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// Body serif — bulletin paragraphs, newspaper body
const bodySerif = Source_Serif_4({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body-serif",
  display: "swap",
});

// Typewriter face — dispatch cards (cork wall)
const typewriter = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-type",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Md Rehan Mollick — Software Engineer",
  description:
    "Building things my own way. Software engineer, builder, and tinkerer.",
  metadataBase: new URL("https://rehanmd.tech"),
  openGraph: {
    title: "Md Rehan Mollick — Software Engineer",
    description:
      "Building things my own way. Software engineer, builder, and tinkerer.",
    url: "https://rehanmd.tech",
    siteName: "rehanmd.tech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Rehan Mollick — Software Engineer",
    description:
      "Building things my own way. Software engineer, builder, and tinkerer.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${pixel.variable} ${mono.variable} ${serif.variable} ${bodySerif.variable} ${typewriter.variable}`;
  return (
    <html lang="en" className={fontVars}>
      <body>
        <SessionProviderClient>{children}</SessionProviderClient>
        <Analytics />
      </body>
    </html>
  );
}
