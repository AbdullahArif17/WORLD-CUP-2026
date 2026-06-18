import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "WC 2026 Live Tracker",
  description:
    "Live scores, fixtures, and group standings for FIFA World Cup 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="mx-auto w-full max-w-[640px] flex-1 px-4 py-5">
            {children}
          </main>
          <footer className="border-t border-white/[0.06] py-5 text-center">
            <p className="text-xs text-white/25">Built by DELL</p>
            <p className="mt-0.5 font-mono text-[10px] text-white/15">
              FIFA World Cup 2026 | USA | CAN | MEX
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
