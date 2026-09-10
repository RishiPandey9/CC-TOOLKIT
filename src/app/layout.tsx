import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rishi Pandey | Full-Stack Developer & AI Engineer",
    template: "%s | Rishi Pandey",
  },
  description:
    "Rishi Pandey is a full-stack developer and AI engineer in Nagpur, India, building intelligent web products, automation systems, and reliable digital experiences.",
  keywords: ["Rishi Pandey", "full-stack developer", "AI engineer", "Next.js developer", "React developer", "Python developer", "Nagpur developer", "AI product engineering"],
  authors: [{ name: "Rishi Pandey", url: siteUrl }],
  creator: "Rishi Pandey",
  publisher: "Rishi Pandey",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: "Rishi Pandey | Full-Stack Developer & AI Engineer",
    description: "Portfolio of Rishi Pandey — building intelligent products from schema to ship.",
    siteName: "Rishi Pandey",
    locale: "en_IN",
    images: [{ url: "/profile.png", width: 1200, height: 1200, alt: "Portrait of Rishi Pandey" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishi Pandey | Full-Stack Developer & AI Engineer",
    description: "Building intelligent digital products from schema to ship.",
    images: ["/profile.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "technology",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

