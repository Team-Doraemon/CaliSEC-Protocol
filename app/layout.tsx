import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AccessTokenProvider from "@/components/AccessTokenProvider"; // ✅ Import Client Wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CaliSEC Protocol",
  description: "Calimero Secure Environment for Communication",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white min-h-screen pb-16`}>
        <AccessTokenProvider>{children}</AccessTokenProvider>
      </body>
    </html>
  );
}
