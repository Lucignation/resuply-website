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

const siteTitle =
  "ReSuply | Shop from anywhere. Trust the local hand that knows the market.";
const siteDescription =
  "ReSuply connects you with verified personal shoppers who buy items from markets, supermarkets, pharmacies, and local stores near you. Join the waitlist for Lagos and Abuja.";
const siteUrl = "https://useresuply.com/";
const previewImage = "https://useresuply.com/resuply-logo-green.jpeg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ReSuply",
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "ReSuply",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: previewImage,
        width: 640,
        height: 640,
        alt: "ReSuply logo.",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
    images: [previewImage],
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
