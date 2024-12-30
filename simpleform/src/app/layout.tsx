import type { Metadata } from "next";
import Image from "next/image";
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
  title: "Vihe",
  description: "Created by deepak",
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
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-teal-200 to-white min-h-screen">
          <header className="flex items-center justify-center mb-2">
            <div className="mr-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-teal-800">
                VIHE Saranagati Retreat 2025
              </h1>
              <p className="text-lg mt-2 text-teal-700">
                February 23 - March 1, 2025 | Govardhan Retreat Centre
              </p>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
