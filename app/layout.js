import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RegisterSW from "./register-sw";
import DataInitializer from "@/components/DataInitializer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Quiz App",
  description: "Learn English Grammar the Fun Way! 🎉",
  category: "website",
  generator: "Next.js",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "E-Quiz App",
  },
  icons: [
    { rel: "apple-touch-icon", url: "apple-icon.png" },
    { rel: "icon", url: "icon.png" },
  ],
  openGraph: {
    type: "website",
    siteName: "Quiz App",
    title: {
      default: "Quiz App",
      template: "%s | Quiz App",
    },
    description: "Learn English Grammar the Fun Way! 🎉",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <main className="min-h-screen">
          {" "}
          {/* Add padding-top */}
          <DataInitializer />
          {children}
          <Analytics />
          <SpeedInsights />
        </main>
        <Footer />
        <RegisterSW />
      </body>
    </html>
  );
}
