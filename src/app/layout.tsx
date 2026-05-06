import type { Metadata } from "next";
import { Space_Mono, Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SessionProviderClient from "@/components/providers/SessionProviderClient";
import "@/styles/globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
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
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${pressStart2P.variable}`}
    >
      <body className="font-sans bg-bg-primary text-text-primary">
        <SessionProviderClient>{children}</SessionProviderClient>
        <Analytics />
      </body>
    </html>
  );
}
