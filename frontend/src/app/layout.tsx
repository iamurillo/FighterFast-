import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SWRegistration from "@/components/SWRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FighterFast - Modo Peleador",
  description: "Ayuno intermitente profesional y registro de entrenamientos",
  manifest: "/manifest.json",
  themeColor: "#e11d48",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRegistration />
        {children}
      </body>
    </html>
  );
}
