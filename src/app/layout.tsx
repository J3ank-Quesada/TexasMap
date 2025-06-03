import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cities information app",
  description: "This is a simple app that allows you to search for cities and get information about them.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Cities information app",
    description: "This is a simple app that allows you to search for cities and get information about them.",
    url: "https://cities-information-app.vercel.app",
    siteName: "Cities information app",
    images: ["/favicon.ico"],
  },
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
        {children}
      </body>
    </html>
  );
}
