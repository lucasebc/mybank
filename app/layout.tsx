import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import "./globals.css";
import { subscribe } from "diagnostics_channel";

const inter = Inter({ subsets: ["latin"] , variable: '--font-inter'});
const ibmPlexSerif = IBM_Plex_Serif({subsets: ['latin'], weight:['400', '700'], variable: '--font-ibm-plex-serif'})

export const metadata: Metadata = {
  title: "My bank",
  description: "My custom bank application uses a modern approach to online banking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>{children}</body>
    </html>
  );
}
