import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/ui/CustomCursor";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "World Cup 2026 | Live Tracker",
  description:
    "Elite live scores, fixtures, and group standings for FIFA World Cup 2026",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${inter.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-card-gold focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-pitch-black"
        >
          Skip to content
        </a>
        <CustomCursor />
        <div className="flex min-h-screen flex-col overflow-x-hidden">
          <Navbar />
          <main
            id="main-content"
            className="mx-auto w-full max-w-6xl flex-1 px-4 py-6"
          >
            {children}
          </main>
          <footer className="border-t border-goal-net/10 py-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-goal-net/25">
              Built by DELL - FIFA World Cup 2026
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
