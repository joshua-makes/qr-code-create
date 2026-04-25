import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://qr-logo-lab.vercel.app'),
  title: {
    default: 'QR Logo Lab',
    template: '%s | QR Logo Lab',
  },
  description:
    'Free QR code generator with logo embedding, custom colors, dot styles, corner styles, and transparent backgrounds — entirely in your browser, no uploads required.',
  keywords: [
    'QR code generator',
    'QR code with logo',
    'custom QR code',
    'QR code maker',
    'free QR code',
    'QR code design',
    'logo QR code',
    'transparent QR code',
  ],
  authors: [{ name: 'QR Logo Lab' }],
  openGraph: {
    type: 'website',
    title: 'QR Logo Lab',
    description:
      'Free QR code generator with logo embedding, custom colors, and more — entirely in your browser.',
    siteName: 'QR Logo Lab',
  },
  twitter: {
    card: 'summary',
    title: 'QR Logo Lab',
    description:
      'Free QR code generator with logo embedding, custom colors, and more — entirely in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

