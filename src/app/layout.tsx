import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenTicker",
  description: "Open Data Compilation and Analysis Tool for Stock Trading",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="fixed w-screen h-screen gradient-background -z-10"></div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
