import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";
import ThreeDBackground from "@/components/ThreeDBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Bliss | Personal Website",
  description:
    "Personal website for Bliss, showcasing her hobbies, passions, and life with Lucy the cat.",
  keywords: [
    "Bliss",
    "Personal Website",
    "Portfolio",
    "Reading",
    "Painting",
    "Cats",
  ],
  authors: [{ name: "Bliss" }],
  creator: "Bliss",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bliss.com",
    title: "Bliss | Personal Website",
    description:
      "Personal website for Bliss, showcasing her hobbies, passions, and life with Lucy the cat.",
    siteName: "Bliss | Personal Website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bliss Personal Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bliss | Personal Website",
    description:
      "Personal website for Bliss, showcasing her hobbies, passions, and life with Lucy the cat.",
    creator: "@bliss",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <PageTransition>
            <ThreeDBackground />
            {children}
            <Analytics />
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
