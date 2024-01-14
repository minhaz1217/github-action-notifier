import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Github Action Notifier",
  description: "Get notified when an action finishes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
