import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-utility",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://useresuply.com"),
  title: "ReSuply — Shop from anywhere. Trust the local hand that knows the market.",
  description:
    "ReSuply connects you with verified personal shoppers who buy items from markets, supermarkets, pharmacies and local stores near you — and earn an income doing it.",
  openGraph: {
    title: "ReSuply",
    description:
      "Shop from anywhere with trusted local shoppers who know the market.",
    url: "https://useresuply.com",
    siteName: "ReSuply",
    images: ["/resuply-logo-green.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
