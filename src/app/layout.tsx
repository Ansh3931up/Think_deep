import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Noto_Sans_Devanagari, Poppins, Merriweather } from "next/font/google"
import "./globals.css"
import { GoogleAnalytics } from "../components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const notoSans = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-noto" })
const poppins = Poppins({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins" 
})
const merriweather = Merriweather({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather" 
})

export const metadata: Metadata = {
  title: "think_deep - Poetry & Thoughts Collection",
  description: "A curated collection of profound thoughts, poetry, and reflections from hearts around the world",
  keywords: "poetry, thoughts, shayari, hindi poetry, english poetry, deep thoughts, literature",
  authors: [{ name: "think_deep" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "think_deep - Poetry & Thoughts Collection",
    description: "A curated collection of profound thoughts, poetry, and reflections",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "think_deep Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "think_deep - Poetry & Thoughts Collection",
    description: "A curated collection of profound thoughts, poetry, and reflections",
    images: ["/logo.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" /> */}
      <meta name="apple-mobile-web-app-title" content="MyWebSite" />
      <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${notoSans.variable} ${poppins.variable} ${merriweather.variable} font-sans bg-black`}>
        <Suspense fallback={null}>
          {children}
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-5JG7TTZBCR"} />
        </Suspense>
      </body>
    </html>
  )
}
