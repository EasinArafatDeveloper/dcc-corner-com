import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';
import SmoothScrollProvider from '@/components/shared/SmoothScrollProvider';
import PushNotificationManager from '@/components/shared/PushNotificationManager';

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

export const viewport: Viewport = {
  themeColor: "#163A32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://dcccorner.com"),
  title: {
    template: "%s | DCC Corner",
    default: "DCC Corner — Premium Imported Chocolates, Snacks & Confectionery in Bashundhara",
  },
  description: "DCC Corner is the #1 premier destination in Bashundhara R/A, Dhaka for 100% authentic imported chocolates, confectionery, Korean ramen, beverages & gourmet snacks with 2-hour express delivery.",
  keywords: [
    "DCC Corner",
    "DCC Corner Bashundhara",
    "DCC Corner Dhaka",
    "DCC Corner Bangladesh",
    "dcccorner.com",
    "Imported chocolates Bangladesh",
    "Premium imported snacks Dhaka",
    "Bashundhara R/A grocery delivery",
    "2 hour express delivery Bashundhara",
    "Wholesale imported confectionery BD",
    "Lindt chocolate Bangladesh",
    "Ferrero Rocher wholesale BD",
    "Toblerone imported chocolate",
    "Lotus Biscoff spread Dhaka",
    "Korean ramen Buldak Bangladesh",
    "Authentic imported drinks Dhaka",
    "Nutella wholesale price BD"
  ],
  authors: [{ name: "DCC Corner", url: "https://dcccorner.com" }],
  creator: "DCC Corner",
  publisher: "DCC Corner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://dcccorner.com",
  },
  openGraph: {
    title: "DCC Corner — Premium Imported Chocolates & Snacks in Bashundhara",
    description: "100% genuine imported chocolates, Korean ramen, gourmet confectionery, and international snacks delivered to your doorstep in Bashundhara R/A.",
    url: "https://dcccorner.com",
    siteName: "DCC Corner",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DCC Corner — Imported Snacks & Chocolates",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DCC Corner — Premium Imported Chocolates & Snacks in Bashundhara",
    description: "100% genuine imported chocolates, confectionery & snacks with 2-Hour Express Delivery in Bashundhara R/A, Dhaka.",
    images: ["/og-image.jpg"],
    creator: "@dcccorner",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "ecommerce",
};

// Global Schema.org JSON-LD definitions
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "DCC Corner",
  "alternateName": ["DCC Corner Bashundhara", "DCC Corner BD", "DCC Corner Confectionery & Grocery"],
  "url": "https://dcccorner.com",
  "logo": "https://dcccorner.com/images/logo.png",
  "image": "https://dcccorner.com/og-image.jpg",
  "description": "DCC Corner is the leading imported snacks, chocolates, beverages and gourmet confectionery store in Bashundhara R/A, Dhaka with 2-hour express delivery.",
  "telephone": "+8801700000000",
  "email": "support@dcccorner.com",
  "priceRange": "৳৳",
  "currenciesAccepted": "BDT",
  "paymentAccepted": "Cash on Delivery, bKash",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Bashundhara R/A",
    "addressLocality": "Dhaka",
    "addressRegion": "Dhaka Division",
    "postalCode": "1229",
    "addressCountry": "BD"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "23.8151",
    "longitude": "90.4255"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "09:00",
    "closes": "23:00"
  },
  "hasMap": "https://maps.google.com/?q=Bashundhara+R/A+Dhaka"
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "DCC Corner",
  "alternateName": "DCC Corner",
  "url": "https://dcccorner.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://dcccorner.com/shop?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

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
      <head>
        <meta name="geo.region" content="BD-13" />
        <meta name="geo.placename" content="Bashundhara R/A, Dhaka" />
        <meta name="geo.position" content="23.8151;90.4255" />
        <meta name="ICBM" content="23.8151, 90.4255" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
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
