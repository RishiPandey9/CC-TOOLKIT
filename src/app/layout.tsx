import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CC-Toolkit | Classical & Modern Cryptography Studio',
  description:
    'High-performance Next.js cryptographic workspace with classical ciphers, multi-layer pipelines, Simplified DES (S-DES), AI cryptanalysis crackers, and DSA math engines.',
  keywords: [
    'cryptography',
    'classical ciphers',
    'Caesar cipher',
    'Playfair cipher',
    'Vigenere cipher',
    'Hill cipher',
    'S-DES',
    'cryptanalysis',
    'DSA',
    'Trie',
    'Extended Euclidean Algorithm'
  ],
  authors: [{ name: 'Rishi Pandey' }],
  creator: 'Rishi Pandey',
  openGraph: {
    title: 'CC-Toolkit | Classical & Modern Cryptography Studio',
    description:
      'High-performance Next.js cryptographic workspace with classical ciphers, multi-layer pipelines, S-DES, and AI cryptanalysis.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
