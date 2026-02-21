import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/frontend/shared/providers/QueryProvider";
import { Toaster } from "@components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Auto Share",
  description: "Automate Meroshare apply IPO and manage multiple accounts",
  keywords: ["meroshare", "IPO", "auto share", "manage multiple accounts"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${playfairDisplay.variable} antialiased
        `}
      >
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
