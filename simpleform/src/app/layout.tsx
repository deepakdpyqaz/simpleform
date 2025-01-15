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
  title: "VIHE Saranagati Retreat 2025",
  description: "",
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
          <header className="flex flex-col items-center sm:flex-row sm:justify-center mb-4">
            <div className="mb-4 sm:mb-0 sm:mr-4">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="object-contain sm:w-[100px] sm:h-[100px]"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-teal-800 sm:text-4xl">
                VIHE Saranagati Retreat 2025
              </h1>
              <p className="text-base mt-2 text-teal-700 sm:text-lg">
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
