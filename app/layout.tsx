import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://foundationary.vercel.app'),
  title: {
    default: 'Foundationary — Business Foundations. Fast.',
    template: '%s | Foundationary',
  },
  description: 'Professional business documents for UK sole traders. Client contracts, GDPR privacy policies, T&Cs, professional bios, and more. Done for you in 24 hours for £79.',
  keywords: ['UK sole trader', 'business documents', 'client contracts', 'GDPR privacy policy', 'Terms and Conditions', 'freelancer documents', 'small business setup UK', 'professional bios', 'elevator pitches', 'invoice templates'],
  authors: [{ name: 'Foundationary' }],
  creator: 'Foundationary',
  publisher: 'Foundationary',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://foundationary.vercel.app',
    siteName: 'Foundationary',
    title: 'Foundationary — Business Foundations. Fast.',
    description: 'Professional business documents for UK sole traders. Client contracts, GDPR privacy policies, T&Cs, professional bios, and more. Done for you in 24 hours for £79.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Foundationary - Business Foundations for UK Sole Traders',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Foundationary — Business Foundations. Fast.',
    description: 'Professional business documents for UK sole traders. Done for you in 24 hours.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://foundationary.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1B3F7A" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Foundationary',
              url: 'https://foundationary.vercel.app',
              logo: 'https://foundationary.vercel.app/logo.png',
              description: 'Professional business documents for UK sole traders. Client contracts, GDPR privacy policies, T&Cs, and more.',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+44-7377-203834',
                contactType: 'customer service',
                email: 'foundationarybusiness@gmail.com',
                availableLanguage: 'English',
              },
              sameAs: [],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'GB',
              },
              priceRange: '££',
            }),
          }}
        />
      </head>
      <body className="font-inter antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
