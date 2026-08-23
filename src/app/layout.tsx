import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dcccorner.com"),
  title: {
    template: "%s | DCC Corner",
    default: "DCC Corner - Premium Imported Chocolates & Snacks in Bangladesh",
  },
  description: "DCC Corner is your ultimate destination for premium imported chocolates, snacks, and exclusive products in Bangladesh. Discover top brands like Lindt, Ferrero Rocher, Pringles, and more.",
  keywords: ["Imported chocolates Bangladesh", "Premium snacks BD", "DCC Corner", "Ferrero Rocher BD", "Lindt chocolate Bangladesh", "Imported grocery"],
  authors: [{ name: "DCC Corner" }],
  openGraph: {
    title: "DCC Corner - Premium Imported Chocolates & Snacks",
    description: "Discover top brands of imported chocolates and snacks in Bangladesh.",
    url: "https://dcccorner.com",
    siteName: "DCC Corner",
    images: [
      {
        url: "https://dcccorner.com/og-image.jpg", // We can define a generic OG image or logo
        width: 1200,
        height: 630,
        alt: "DCC Corner Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

import NextTopLoader from 'nextjs-toploader';
import SmoothScrollProvider from '@/components/shared/SmoothScrollProvider';
import PushNotificationManager from '@/components/shared/PushNotificationManager';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextTopLoader
          color="#163A32"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #163A32,0 0 5px #D6A84F"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-backdrop"></div><div class="spinner-icon"></div></div>'
          zIndex={1600}
          showAtBottom={false}
        />
        <SmoothScrollProvider>
          <PushNotificationManager />
          {children}
        </SmoothScrollProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
